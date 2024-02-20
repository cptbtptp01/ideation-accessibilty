import * as React from "react";
import { createRoot } from "react-dom/client";
import { BoardNode } from "@mirohq/websdk-types";

import "../src/assets/style.css";
import { groupItems } from "./grouping";
import GroupingList from "./components/groupingList";
import ActivityList from "./components/activityList"

const App: React.FC = () => {
  const [groups, setGroups] = React.useState<{
    [key: string]: BoardNode[];
  }>({});

  const [messages, setMessages] = React.useState<string[]>([]);

  const handleUpdateGrouping = async () => {
    const updatedItemMap = await groupItems();
    setGroups(updatedItemMap);
  };

  React.useEffect(() => {
    // WIP: structure overview feature
    async function fetchData() {
      const itemMap = await groupItems();
      setGroups(itemMap);
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
    <div className="grid">
      <GroupingList groups={groups} onUpdateGrouping={handleUpdateGrouping}/>
      <ActivityList messages={messages} />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
