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
  // groupItems returns a JSON object
  const [groups, setGroups] = React.useState<{ [key: string]: Cluster }>({});

  const [messages, setMessages] = React.useState<string[]>([]);

  const handleUpdateGrouping = async () => {
    const updatedJson = await groupItems(); // return Promise<string>
    const finalUpdatedJson = await addTitle(updatedJson);
    setGroups(finalUpdatedJson);
  };

  React.useEffect(() => {
    async function fetchData() {
      const groupingJson = await groupItems();
      const finalJson = await addTitle(groupingJson);
      setGroups(finalJson);
    }

    fetchData();
  }, []);

  return (
    <div className="grid">
      <GroupingList groups={groups} onUpdateGrouping={handleUpdateGrouping}/>
      <ActivityList messages={messages} />
      <Notifications setMessages={setMessages} />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
