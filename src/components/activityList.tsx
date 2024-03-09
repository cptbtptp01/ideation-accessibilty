import * as React from "react";

interface Props {
  messages: string[];
}

const ActivityList: React.FC<Props> = ({ messages }) => {
  return (
    <div className="cs1 ce12" role="region" aria-label="Activities">
      <h1>Activities</h1>
      <ul role="list">
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
