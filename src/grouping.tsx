import { BoardNode } from "@mirohq/websdk-types";
import cluster from "cluster";
import { GetColorName } from "hex-color-to-color-name";

// build hierarchy
async function collectItemsByFrame(items: BoardNode[]) {
  // {frame1:[node1, node2,..], frame2: [node1, node2,...]}
  const frameMap: { [key: string]: BoardNode[] } = {};

  for (const item of items) {
    if (item.type === "frame" && item.childrenIds.length > 0) {
      const children = await miro.board.get({ id: item.childrenIds });
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
function determineColor(id: string, items: BoardNode[]) {
  let color;
  if (item.type === "card") {
    color = GetColorName(item.style.cardTheme);
  } else if (item.type === "shape") {
    // cases: same border color & fill color, only have fill color/border color, different boarder color and fill color
    color =
      item.style.fillColor !== "transparent"
        ? GetColorName(item.style.fillColor)
        : GetColorName(item.style.borderColor); // hex
  } else if (item.type === "sticky_note") {
    color = item.style.fillColor;
  } else if (item.type === "text") {
    color = GetColorName(item.style.color);
  } else {
    color = "Uncolored";
  }
  return color; // colorname
}

// ------------------- Processing --------------------------
export async function groupItems() {
  const items = await miro.board.get(); // BoardNode[]

  // Processing, clear all the containers
  // void cleanAllContainers();

  // Preprocesing, output: containers
  // void preprocesingByType() {}

  // Processing
  // void processing() { // TBD
  // cluster by distance
  map < title, List[id] > groupingByDistance(items);

  // }

  // Return
  // return a json

  const itemMap: { [key: string]: BoardNode[] } = {};

  items.forEach((item) => {
    const color = determineColor(item);

    if (color in itemMap) {
      itemMap[color].push(item);
    } else {
      itemMap[color] = [item];
    }
  });

  items.forEach((item) => {
    if (item.type === "shape") {
      let shape = item.shape;

      if (shape in itemMap) {
        itemMap[shape].push(item);
      } else {
        itemMap[shape] = [item];
      }
    }
  });

  return itemMap;
}

// ------------------- Helper --------------------------

// Helper function
// clusters[] preprocesingByDistance(array: [id1, id2, ...]) {}
// return [[id1, id2, ...], [id7, id8, ...]]

// Grouping by color
// clusters[] preprocesingByColor(array: [id1, id2, ...]) {}
// return {color: [id1, id2, ...], color: [id7, id8, ...]...}
