import * as React from "react";
import { createRoot } from "react-dom/client";

import "../src/assets/style.css";
import { groupItems } from "./grouping";
import GroupingList from "./components/groupingList";
import { Cluster } from "./components/groupingList";
import ActivityList from "./components/activityList"
import Notifications from "./notifications";
import { addTitle } from "./ai";

const App: React.FC = () => {
  const [groups, setGroups] = React.useState<{ [key: string]: Cluster }>({});
  const [messages, setMessages] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true); // Initially set to true

  const handleUpdateGrouping = async () => {
    setIsLoading(true);
    setMessages(["Generating summary for the board..."]);
    try {
      const updatedJson = await groupItems(); // return Promise<string>
      const finalUpdatedJson = await addTitle(updatedJson);
      setGroups(finalUpdatedJson);
    } catch (error) {
      console.error("Error updating grouping:", error);
      setMessages(["Error occurred while updating grouping."]);
    } finally {
      setIsLoading(false);
      setMessages([]);
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      const groupingJson = await groupItems();
      const finalJson = await addTitle(groupingJson);
      setGroups(finalJson);
      setIsLoading(false); // Once initial data fetching is complete, set isLoading to false
    }

    fetchData();
  }, []);

  return (
    <div className="grid">
      {isLoading && <div className="cs1 ce12" role="region" aria-label="Overview">Generating summary for the board...</div>}
      <GroupingList groups={groups} onUpdateGrouping={handleUpdateGrouping}/>
      <ActivityList messages={messages} />
      <Notifications setMessages={setMessages} />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
