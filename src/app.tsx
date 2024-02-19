import * as React from "react";
import { createRoot } from "react-dom/client";
import { BoardNode } from "@mirohq/websdk-types";

import "../src/assets/style.css";
import { groupItemsByColor } from "./grouping";
import GroupingList from "./components/groupingList";
import ActivityList from "./components/activityList"

const App: React.FC = () => {
  const [colorGroups, setColorGroups] = React.useState<{
    [key: string]: BoardNode[];
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
    <div className="cs1 ce2">
      <GroupingList groups={colorGroups} />
      <ActivityList messages={messages} />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
