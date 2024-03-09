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
        To continue learning, use Control + Option + Shift + Down arrow.
      </div>
      {Object.keys(groups).map((clusterKey) => (
        <div
          key={clusterKey}
          role="group"
          aria-label={`This group is about ${groups[clusterKey].title}`}
        >
          <h2>{groups[clusterKey].title}</h2>
          {Array.isArray(groups[clusterKey].content) ? (
            <div
              role="group"
              aria-label={`summary for group ${groups[clusterKey]}`}
            >
              {groups[clusterKey].content.map((item, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </div>
          ) : (
            Object.keys(groups[clusterKey].content).map((groupKey) => (
              <div
                key={groupKey}
                role="group"
                aria-label={`This group is about ${groups[clusterKey].content[groupKey].title}`}
              >
                <h3>{groups[clusterKey].content[groupKey].title}</h3>
                {Array.isArray(groups[clusterKey].content[groupKey].content) ? (
                  <div>
                    {groups[clusterKey].content[groupKey].content.map(
                      (item, index) => (
                        <p
                          key={index}
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div>
                    <p>{groups[clusterKey].content[groupKey].content}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupingList;
