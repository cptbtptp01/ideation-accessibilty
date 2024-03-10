import * as React from "react";

interface Props {
  messages: string[];
}

const ActivityList: React.FC<Props> = ({ messages }) => {
  const listRef = React.useRef<HTMLUListElement>(null);
  const prevMessagesRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    // Update previous messages reference
    prevMessagesRef.current = messages;
  }, [messages]);

  React.useEffect(() => {
    // Filter out duplicate messages
    const newMessages = messages.filter(message => !prevMessagesRef.current.includes(message));
    if (newMessages.length > 0) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
        playNotificationSound();
      }
    }
  }, [messages]);

  const playNotificationSound = () => {
    const audio = new Audio("../assets/notification.wav");
    audio.play();
  };

  return (
    <div className="cs1 ce12" role="region" aria-label="Activities">
      <h1>Activities</h1>
      <ul ref={listRef} role="list">
        {messages.map((message, index) => (
          <li key={index} role="listitem">
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
