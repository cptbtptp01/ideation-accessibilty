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
  const activityListRef = React.useRef<HTMLDivElement>(null);
  const groupingListRef = React.useRef<HTMLDivElement>(null);

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

  const handleMoveToActivities = () => {
    if (activityListRef.current) {
      activityListRef.current.focus();
    }
  };

  const handleMoveToGrouping = () => {
    if (groupingListRef.current) {
      groupingListRef.current.focus();
    }
  }


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
      <div className="cs1 ce12" ref={groupingListRef} id="groupingList" tabIndex={-1} aria-label="Overview">
        <GroupingList groups={groups} onUpdateGrouping={handleUpdateGrouping} />
      </div>
      <div className="cs1 ce12" ref={activityListRef} id="activityList" tabIndex={-1} aria-label="Activities">
        <ActivityList messages={messages} />
      </div>
      <Notifications setMessages={setMessages} />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
