import * as React from "react";
import { createRoot } from "react-dom/client";

import "../src/assets/style.css";

async function addSticky() {
  const stickyNote = await miro.board.createStickyNote({
    content: "Hello, World!",
  });

  await miro.board.viewport.zoomTo(stickyNote);
}

async function countItems() {
  const items = await miro.board.get();
  const countMap: { [key: string]: number } = {};

  items.forEach((item) => {
    countMap[item.type] = (countMap[item.type] || 0) + 1;
  });
  return countMap;
}

const App: React.FC = () => {
  const [itemCounts, setItemCounts] = React.useState<{ [key: string]: number }>(
    {}
  );
  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function fetchItemCounts() {
      const counts = await countItems();
      setItemCounts(counts);
    }
    fetchItemCounts();

    // Listen to the 'items:create' event.
    miro.board.ui.on("items:create", async (event) => {
      // array of created items
      const createdItems = event.items;
      // update counts
      const counts = await countItems();
      setItemCounts(counts);
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
      // update counts
      const counts = await countItems();
      setItemCounts(counts);
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
          <h2>Activities</h2>
          <ul role="list">
            {messages.map((message, index) => (
              <li key={index} role="listitem">
                {message}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Item Counts</h2>
          <dl role="list">
            {Object.keys(itemCounts).map((type, index) => (
              <div key={index} role="listitem">
                <dt>{type}</dt>
                <dd>{itemCounts[type]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
