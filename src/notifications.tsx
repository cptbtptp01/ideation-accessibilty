import { useEffect } from "react";

interface User {
  id: string;
  name: string;
}

interface Item {
  type: string;
  createdBy: string;
  style: {
    fillColor: string;
  };
}

interface MiroEvent {
  items?: Item[];
  users?: User[];
}

type EventHandler = (event: MiroEvent) => void;

const useMiroEvent = (
  eventType: string,
  eventHandler: EventHandler,
  setMessages: React.Dispatch<React.SetStateAction<string[]>>
) => {
  useEffect(() => {
    miro.board.ui.on(eventType, eventHandler);

    return () => {
      miro.board.ui.off(eventType, eventHandler);
    };
  }, [eventType, eventHandler, setMessages]);
};

const Notifications: React.FC<{
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ setMessages }) => {
  let currentOnlineUsers: User[] = [];

  // Item Creation Event
  const handleItemCreate: EventHandler = async (event) => {
    const createdItems = event.items || [];
    const newMessages = createdItems.map(
      (item) =>
        `A new ${item.type} with ${item.style.fillColor} color is created`
    );
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  // Item Updation Event
  const handleItemUpdate: EventHandler = async (event) => {
    const updatedItems = event.items || [];
    const newMessages = updatedItems.map(
      (item) => `A new ${item.type} is updated`
    );
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  // Item Deletion Event
  const handleItemDelete: EventHandler = async (event) => {
    const deletedItems = event.items || [];
    const newMessages = deletedItems.map(
      (item) => `A ${item.type} with ${item.style.fillColor} color was deleted`
    );
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  const handleUsers: EventHandler = async (event) => {
    const onlineUsers = event.users || [];

    const newUsers = onlineUsers.filter(
      (user) => !currentOnlineUsers.find((u) => u.id === user.id)
    );

    // Greet the new online users.
    for (const newUser of newUsers) {
      await miro.board.notifications.showInfo(`Hello, ${newUser.name}!`);
    }

    const newMessages = newUsers.map((user) => `${user.name} joined the board`);

    currentOnlineUsers = onlineUsers;
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  useMiroEvent("items:create", handleItemCreate, setMessages);
  useMiroEvent("experimental:items:update", handleItemUpdate, setMessages);
  useMiroEvent("items:delete", handleItemDelete, setMessages);
  useMiroEvent("online_users:update", handleUsers, setMessages);

  // Render nothing, as this component handles side effects
  return null;
};

export default Notifications;
