import { BoardNode } from "@mirohq/websdk-types";
import * as React from "react";

interface Props {
    groups: { [key: string]: BoardNode[] };
    onUpdateGrouping: () => void;
}

const GroupingList: React.FC<Props> = ({ groups, onUpdateGrouping }) => {
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
                Tip: Use arrow keys to navigate the list.
            </div>
            {Object.entries(groups).map(([color, items]) => (
                <div key={color} role="group" aria-label={`summary for ${color} group`}>
                    <h2>{color}</h2>
                    <ul>
                        {items.map((item, index) => (
                            <li key={index} aria-label={item.type === "card" ? `${item.type}: ${item.title}` : `${item.type}: ${item.content}`}>
                                {item.type === "card" ? (
                                    <span>{`${item.type}: ${item.title}`}</span>
                                ) : (
                                    <span>{`${item.type}: ${item.content}`}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default GroupingList;
