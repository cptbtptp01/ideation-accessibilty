// methods for grouping items by color, shape, item type
// import function with keywords export into app.tsx

// color grouping - should lookup for types with attribute color, e.g. sticker, shape,
export async function groupItemsByColor() {
    const items = await miro.board.get();
    // TODO: current is hex code for colors
    // TBD: nested map: {"hex_code": {"type": ["content1", "content2", ..]}}
    const colorMap: { [key: string]: string[] } = {}; // {"hex_code": ["{type}: {content}"]}

    items.forEach((item) => {
        let color;
        let content;
        if (item.type === "card") {
            color = item.style.cardTheme;
            content = item.title;
        } else if (item.type === "shape") {
            // have same border color & fill color, only have fill color, have different boarder color and fill color,
            // group by fill color for now TBD
            color = item.style.fillColor !== "transparent" ? item.style.fillColor : item.style.borderColor;
            content = item.content;
        } else if (item.type === "sticky_note") {
            color = item.style.fillColor;
            content = item.content;
        } else if (item.type === "text") {
            color = item.style.color;
            content = item.content;
        }

        if (color in colorMap) {
            colorMap[color].push(item.type + ": " + content); // TODO: debug, got "undefined 1undefined: undefined"
        } else {
            colorMap[color] = [item.type + ": " + content];
        }
    });

    return colorMap;
}
