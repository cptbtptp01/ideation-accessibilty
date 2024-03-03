import * as React from "react";

interface Props {
  messages: string[];
}

const ActivityList: React.FC<Props> = ({ messages }) => {
  return (
    <div
      className="cs1 ce12"
      aria-roledescription="activities"
      id="log"
      aria-labelledby="activitiesheading"
    >
      <h1 id="activitiesheading">Activities</h1>
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
