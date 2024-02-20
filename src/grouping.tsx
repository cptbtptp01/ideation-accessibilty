import { BoardNode } from "@mirohq/websdk-types";

interface HierarchyElement {
    id: string;
    type: string; //"frame", "group", "shape"
    parentId?: string // if it has ancestor
    children?: BoardNode[];
}

// build hierarchy
async function collectItemsByFrame(items : BoardNode[]) {
    // {frame1:[node1, node2,..], frame2: [node1, node2,...]}
    const frameMap : { [key: string]: BoardNode[]} = {}

    for (const item of items) {
        if (item.type === "frame" && item.childrenIds.length > 0) {
                const children = await miro.board.get( {id: item.childrenIds});
                frameMap[item.id] = children;
            }
            // todo: handle nested cases
        }
        return frameMap;
    }

function collectItemsByGroup() {
    // impl
}

function collectItemsByVisual() {
    // impl
}

function collectItemByDistance() {
    // impl
}

// helper
function determineColor(item : BoardNode) {
    let color;
    if (item.type === "card") {
        color = item.style.cardTheme; // hex
    } else if (item.type === "shape") {
        // cases: same border color & fill color, only have fill color/border color, different boarder color and fill color
        color = item.style.fillColor !== "transparent" ? item.style.fillColor : item.style.borderColor; // hex
    } else if (item.type === "sticky_note") {
        color = item.style.fillColor; // not hex
    } else if (item.type === "text") {
        color = item.style.color; // hex
    }
    return color;
}

// call this function after collecting items by different hierarchy function
async function groupItems(children : BoardNode[]) {

    const itemMap: { [key: string]: BoardNode[] } = {};

    // {color_string: [item1, item1,..]}
    for (const child of children) {
        const color = determineColor(child);
        if (color in itemMap) {
            itemMap[color].push(child);
        } else {
            itemMap[color] = [child];
        }
    }
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
