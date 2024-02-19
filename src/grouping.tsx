// methods for grouping items by color, shape, item type
// import function with keywords export into app.tsx

import { BoardNode } from "@mirohq/websdk-types";

// color grouping - should lookup for types with attribute color, e.g. sticker, shape,
export async function groupItemsByColor() {
    const items = await miro.board.get();
    // TODO: current is hex code for colors
    // TBD: nested map: {"hex_code": {"type": ["content1", "content2", ..]}}
    const colorMap: { [key: string]: BoardNode[] } = {}; // {"hex_code": [item1, item2....]}

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
        }

        if (color in colorMap) {
            colorMap[color].push(item); // TODO: debug, got "undefined 1undefined: undefined"
        } else {
            colorMap[color] = [item];
        }
    });

    return colorMap;
}
