import * as React from "react";

interface GroupContent {
  title: string;
  content: any; // string[] or obj
}

export interface Cluster {
  title: string;
  content: { [key: string]: GroupContent } | string[];
}
interface Props {
  groups: { [key: string]: Cluster };
  onUpdateGrouping: () => void;
}

const GroupingList: React.FC<Props> = ({ groups, onUpdateGrouping }) => {
  console.log(groups)
  const initialAnnouncement =
    `There are ${Object.keys(groups).length} parts of the board. ` +
    Object.keys(groups)
      .map((clusterKey) => {
        return `${clusterKey} is about ${groups[clusterKey].title}.`;
      })
      .join(" ");

      return (
        <div className="cs1 ce12" role="region" aria-label="Overview">
          <h1 aria-label="Overview">Overview</h1>
          <button
            className="update-overview-button button button-primary button-medium"
            type="button"
            onClick={onUpdateGrouping}
            aria-label="Update Overview"
          >
            Update Overview
          </button>
          <div className="sr-only" aria-live="polite">
            To continue learning, use Control + Option + Shift + left arrow.
          </div>
          {Object.keys(groups).map((clusterKey) => (
            Array.isArray(groups[clusterKey].content) ? (
              <div
                key={clusterKey}
                role="group"
                aria-label={`The board is about ${groups[clusterKey]}`}
              >
              </div>
            ) : (
              Object.keys(groups[clusterKey].content).map((groupKey) => (
                <div
                  key={groupKey}
                  role="group"
                  aria-label={`There are ${Array.isArray(groups[clusterKey].content) ? groups[clusterKey].content.length : Object.keys(groups[clusterKey].content).length} items appear to be ${groups[clusterKey].content[groupKey].title}`}
                >
                  <h3>{groups[clusterKey].content[groupKey].title}</h3>
                  {Array.isArray(groups[clusterKey].content[groupKey].content) ? (
                    <div>
                    </div>
                  ) : (
                    <div>
                      <p>{groups[clusterKey].content[groupKey].content}</p>
                    </div>
                  )}
                </div>
              ))
            )
          ))}
        </div>
      );
                  }

export default GroupingList;
