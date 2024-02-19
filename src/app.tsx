import * as React from "react";
import { createRoot } from "react-dom/client";

import "../src/assets/style.css";

import { groupItemsByColor } from "./grouping";

const App: React.FC = () => {
  // group by color
  const [colorGroups, setColorGroups] = React.useState<{
    [key: string]: { type: string; content: string }[];
  }>({});

  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    // WIP: structure overview feature
    // TBD: a button for regeneration if board content updated?
    async function fetchData() {
      // {"hex_code": ["{type}: {content}"]}
      const colorMap = await groupItemsByColor();
      setColorGroups(colorMap);
    }

    fetchData();

    // WIP: notification feature
    // TODO(hy): gernalize the event listener, it is doable to have one function and pass the event type as a parameter
    // Listen to the 'items:create' event.
    miro.board.ui.on("items:create", async (event) => {
      // array of created items
      const createdItems = event.items;
      // update messages
      const newMessages = createdItems.map(
        (item: { type: string; createdBy: string }) => {
          return `A new ${item.type} was created by userId: ${item.createdBy}`;
        }
      );
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    });

    // Listen to the 'items:delete' event.
    miro.board.ui.on("items:delete", async (event) => {
      // array of deleted items
      const deletedItems = event.items;
      // update messages
      const newMessages = deletedItems.map(
        (item: { type: string; createdBy: string }) => {
          return `A ${item.type} was deleted by userId: ${item.createdBy}`;
        }
      );
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    });
  }, []);

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12" role="region" aria-label="Item Information">
        <div>
          {Object.entries(colorGroups).map(([color, items]) => (
            <div key={color}>
              <h2 style={{ textTransform: 'capitalize' }}>{color}</h2>
              <ul>
                {(items as { type: string; content: string }[]).map(
                  (item, index) => (
                    <li key={index}>
                      <span className="sr-only">{`${item.type} ${
                        index + 1
                      }`}</span>
                      {`${item.type}: ${item.content}`}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h2>Activities</h2>
          <ul role="list">
            {messages.map((message, index) => (
              <li key={index} role="listitem">
                {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
