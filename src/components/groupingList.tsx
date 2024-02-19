import { BoardNode } from "@mirohq/websdk-types";
import * as React from "react";

interface Props {
    groups: { [key: string]: BoardNode[] };
}

const GroupingList: React.FC<Props> = ({ groups }) => {
    return (
            <div
            role="region"
            aria-roledescription="overview"
            id="summary"
            aria-labelledby="overviewheading">
                <h1 id="overviewheading">Overview</h1>
                {Object.entries(groups).map(([color, items]) => (
                    <div key={color}>
                        <h2>{color}</h2>
                        <ul>
                            {items.map((item, index) => (
                                <li key={index}>
                                    {item.type === 'card' ? (
                                        `${item.type}: ${item.title}`
                                    ) : (
                                        `${item.type}: ${item.content}`
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
