import { BoardNode } from "@mirohq/websdk-types";
import * as React from "react";

interface Props {
  groups: { [key: string]: BoardNode[] };
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
      {Object.entries(groups).map(([color, items]) => (
        <div key={color}>
          <h2>{color}</h2>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.type === "card"
                  ? `${item.type}: ${item.title}`
                  : `${item.type}: ${item.content}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GroupingList;
