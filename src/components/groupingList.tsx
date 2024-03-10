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

function stripHtmlTags(htmlString: string) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;
  return tempElement.textContent || tempElement.innerText || "";
}

const GroupingList: React.FC<Props> = ({ groups, onUpdateGrouping }) => {
  console.log(groups);

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
      {Object.keys(groups).map((clusterKey) => {
        const cluster = groups[clusterKey];
        return (
          <div
            key={clusterKey}
            role="group"
            aria-label={`The board is about ${cluster.title}`}
          >
            <h2>{cluster.title.replace(/"/g, "")}</h2>
            {Array.isArray(cluster.content)
              ? // Render if cluster content is an array
                cluster.content.map((item, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))
              : // Render if cluster content is an object
                Object.keys(cluster.content).map((groupKey) => {
                  const group = cluster.content[groupKey];
                  return (
                    <div
                      key={groupKey}
                      role="group"
                      aria-label={`There are ${
                        Array.isArray(group.content)
                          ? group.content.length
                          : Object.keys(group.content).length
                      } items appear to be ${group.title}`}
                    >
                      <h3>{group.title.replace(/"/g, "")}</h3>
                      {Array.isArray(group.content) ? (
                        // Render if group content is an array
                        <ul>
                          <p>Board contents belong to this section:</p>
                          {group.content.map((item, index) => (
                            <li key={index}>{stripHtmlTags(item)}</li>
                          ))}
                        </ul>
                      ) : (
                        // Render if group content is a string
                        <ul>
                          <p>Board contents belong to this section:</p>
                          <li>{stripHtmlTags(group.content)}</li>
                        </ul>
                      )}
                    </div>
                  );
                })}
          </div>
        );
      })}
    </div>
  );
};

export default GroupingList;
