// notifications.tsx
import { useEffect } from "react";

const useMiroEvent = (eventType, eventHandler, setMessages) => {
    useEffect(() => {
        miro.board.ui.on(eventType, eventHandler);

        return () => {
        miro.board.ui.off(eventType, eventHandler);
        };
    }, [eventType, eventHandler, setMessages]);
};

const Notifications = ({ setMessages }) => {
    // Item Creation Event
    const handleItemCreate = async (event) => {
        const createdItems = event.items;
        const newMessages = createdItems.map(
        (item: { type: string; createdBy: string }) => {
            return `A new ${item.type} was created by userId: ${item.createdBy}`;
        }
        );
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    };

    // Item Deletion Event
    const handleItemDelete = async (event) => {
        const deletedItems = event.items;
        const newMessages = deletedItems.map(
        (item: { type: string; createdBy: string }) => {
            return `A ${item.type} was deleted by userId: ${item.createdBy}`;
        }
        );
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    };

    useMiroEvent("items:create", handleItemCreate, setMessages);
    useMiroEvent("items:delete", handleItemDelete, setMessages);

    // Render nothing, as this component handles side effects
    return null;
};

export default Notifications;
