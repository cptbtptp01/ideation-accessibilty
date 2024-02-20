import { BoardNode } from "@mirohq/websdk-types";

// color grouping - should lookup for types with attribute color, e.g. sticker, shape,
export async function groupItems() {
    const items = await miro.board.get();
    // TODO: check color output
    const itemMap: { [key: string]: BoardNode[] } = {};

    items.forEach((item) => {
        let color;
        if (item.type === "card") {
            color = item.style.cardTheme;
        } else if (item.type === "shape") {
            // have same border color & fill color, only have fill color, have different boarder color and fill color,
            // TBD: group by fill color for now
            color = item.style.fillColor !== "transparent" ? item.style.fillColor : item.style.borderColor;
        } else if (item.type === "sticky_note") {
            color = item.style.fillColor;
        } else if (item.type === "text") {
            color = item.style.color;
        } else {
            color = "Uncolored"
        }

        if (color in itemMap) {
            itemMap[color].push(child);
        } else {
            itemMap[color] = [child];
        }
    });

    items.forEach((item) => {

        if(item.type === "shape") {
            let shape = item.shape

            if(shape in itemMap) {
                itemMap[shape].push(item);
            } else {
                itemMap[shape] = [item];
            }
        }

    })

    return itemMap;
};

// todo
export async function getHierarchyGroups() {
    const items = await miro.board.get();
    const hierarchyMap : { [key: string]: { [key: string]: BoardNode[] } } = {}; // {frameid: {color: [node1, node2, ..]}}
    const frameMap = collectItemsByFrame(items);
    for (const [frameId, children] of Object.entries(frameMap)) {
        hierarchyMap[frameId] = await groupItems(children); // Await the groupItems function call
    }

    return hierarchyMap;
}
