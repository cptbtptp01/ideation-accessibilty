import { BoardNode } from "@mirohq/websdk-types";
import * as React from "react";

interface Props {
  groups: string;
  onUpdateGrouping: () => void;
}

const GroupingList: React.FC<Props> = ({ groups, onUpdateGrouping }) => {
  return (
    <div
      className="cs1 ce12"
      role="region"
      aria-roledescription="overview"
      id="summary"
      aria-labelledby="overviewheading"
    >
      <h1 id="overviewheading">Overview</h1>
      <button
        className="button button-primary button-medium"
        type="button"
        onClick={onUpdateGrouping}
      >
        Update Overview
      </button>
      {/* raw json for now to test the grouping out put */}
      <pre>{groups}</pre>
    </div>
  );
};

export default GroupingList;
