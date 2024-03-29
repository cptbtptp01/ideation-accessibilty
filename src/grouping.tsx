//@ts-nocheck
import { BoardNode, Json } from "@mirohq/websdk-types";
import { GetColorName } from "hex-color-to-color-name";
import { kMeansClusteringWrapper } from "./kMeansClustering";

import data from "./data/grouping/stickyColor";

const GROUPING_THRESHOLD = 5;
const PARENT_ID_FOR_FLOATING = "floating";
const NO_CONTENT_MSG = "No content available.";
const NO_TITLE_MSG = "No Title";

// Global variable to make Miro items accessible throughout the file
let items: BoardNode[]; // TODO: Consider to use map

// Sets to store IDs of items based on their categorization
let floatingSet: Set<string> = new Set();
let connectorSet: Set<string> = new Set(); // TODO: To be used later
let frameMap: Map<string, Set<string>> = new Map();
let groupMap: Map<string, Set<string>> = new Map();

/**
 * Groups Miro board items by rule based algorithm.
 */
export async function groupItems() {
  // Fetches all board items
  items = await miro.board.get();

  // Resets all containers for a fresh start
  cleanAllContainers();

  // Sorts items into proper containers
  allocateToContainers();

  // Initializes the array to hold the final clusters
  let jsonObject = {};
  processAllItems(jsonObject);

  // Conver to a string without modifying any properties and with an indentation of 2 spaces
  // return JSON.stringify(jsonObject, null, 2);
  return jsonObject;
}

/**
 * Process all array/sets of items and update the jsonObject.
 * First apply spatial clustering based on distance to further refine clusters.
 * Seond, further break down this cluster into smaller groups based on color and type if applicable.
 */
function processAllItems(jsonObject: any) {
  for (const [parentId, cluster] of frameMap) {
    processCluster(Array.from(cluster), parentId, jsonObject);
  }
  // Looks like "group" is for "frame"? Need to confirm
  // for (const [parentId, cluster] of groupMap) {
  //   processCluster(Array.from(cluster), parentId, jsonObject);
  // }
  processCluster(Array.from(floatingSet), PARENT_ID_FOR_FLOATING, jsonObject);
}

/**
 * Process one array/set and update the jsonObject.
 */
function processCluster(
  rawInputs: string[],
  parentId: string,
  jsonObject: any
) {
  const clusters: string[][] = kMeansClusteringWrapper(rawInputs, items); // TODO: handling connectors (maybe later)

  for (const subCluster of clusters) {
    if (subCluster.length > GROUPING_THRESHOLD) {
      // Further group by color or type
      let colorGroups = groupByColors(subCluster);
      let typeGroups = groupByTypes(subCluster);
      let result = evaluateClusters(colorGroups, typeGroups);
      const largeClusterJsonObject = processLargeCluster(result, parentId);
      addToResJson(largeClusterJsonObject, jsonObject);
    } else {
      const singleJsonObject = createJsonObject(subCluster, parentId);
      addToResJson(singleJsonObject, jsonObject);
    }
  }
}

/**
 * Process large cluster (further grouping by color or type) and return a json of json object.
 */
function processLargeCluster(subGroups: string[][], parentId: string): Json {
  let largeClusterJsonObject = {};
  largeClusterJsonObject["title"] = NO_TITLE_MSG;
  largeClusterJsonObject["content"] = {};
  subGroups.forEach((groupedItems, idx) => {
    const singleJsonObject = createJsonObject(groupedItems, parentId);
    if (
      singleJsonObject &&
      Array.isArray(singleJsonObject.content) &&
      singleJsonObject.content.length > 0
    ) {
      const curLen = Object.keys(largeClusterJsonObject["content"]).length;
      const curGroupID = `group_${String.fromCharCode(97 + curLen)}`; // group_a, group_b, group_c, ...
      largeClusterJsonObject["content"][curGroupID] = singleJsonObject;
    }
  });
  console.log(largeClusterJsonObject);
  return largeClusterJsonObject;
}

/**
 * Add new generated jsonObject to the resultJsonObject.
 */
function addToResJson(newContent: Json, resultJsonObject: Json) {
  if (!newContent) {
    return;
  }
  const curLen = Object.keys(resultJsonObject).length;
  const curClusterId = `cluster_${curLen + 1}`; // cluster_1, cluster_2, cluster_3, ...
  resultJsonObject[curClusterId] = newContent;
}

/**
 * Generates content in a specified format as an jsonObject. If the cluster has no content, return null.
 */
function createJsonObject(
  cluster: string[],
  parentId: string
): jsonObject {
  // Get contents
  let contentArray = [];
  for (const id of cluster) {
    const content = getContent(id);
    if (content !== NO_CONTENT_MSG) {
      contentArray.push(content);
    }
  }
  if (contentArray.length === 0) {
    return null;
  }
  let newTitle = getTitle(parentId);
  const newJsonObject = {
    title: newTitle,
    content: contentArray
  };
  console.log(newJsonObject);
  return newJsonObject;
}

/**
 * Get content of an item by its ID. If the item has no content, return a default message.
 */
function getContent(id: string): string {
  const item = items.find((item) => item.id === id);
  if (item && item.content) {
    return item.content;
  } else {
    return NO_CONTENT_MSG;
  }
}

/**
 * Get title of an item by its parent ID. If the item has no title, return a default message.
 */
function getTitle(parentId: string): string {
  const item = items.find((item) => item.id === parentId);
  if (item && item.title) {
    return item.title;
  } else {
    return NO_TITLE_MSG;
  }
}

/**
 * Clears all containers to prepare for new summarized action.
 */
function cleanAllContainers(): void {
  frameMap.clear();
  groupMap.clear();
  floatingSet.clear();
  connectorSet.clear();
}

/**
 * Organizes board items into categorized containers.
 * @example
 * {
 *  "frameId1": ["id1", "id2", ...],
 *  "frameId2": ["id3", "id4", ...],
 *  "frameId3": ["id5", "id6", ...],
 *  ...
 * }
 */
function allocateToContainers(): void {
  for (const item of items) {
    if (item.type === "frame") {
      const childrenIds = item.childrenIds;
      frameMap.set(item.id, new Set(childrenIds));
    } else if (item.type === "group") {
      const childrenIds = item.itemsIds;
      groupMap.set(item.id, new Set(childrenIds));
    } else if (item.type === "connector") {
      connectorSet.add(item.id);
    } else {
      floatingSet.add(item.id);
    }
  }
  subtractFrameGroupItems();
}

/**
 * Helper function to remove items belonging to a group or frame from the floating set.
 */
function subtractFrameGroupItems(): void {
  for (const children of frameMap.values()) {
    for (const child of children) {
      floatingSet.delete(child);
    }
  }
  for (const children of groupMap.values()) {
    for (const child of children) {
      floatingSet.delete(child);
    }
  }
}

/**
 * Groups items within a cluster based on their color.
 * @param cluster A set of item IDs as strings.
 * @returns A list of color groups, each containing a list of item IDs.
 */
function groupByColors(cluster: string[]): string[][] {
  const colorMap: Map<string, string[]> = new Map();
  for (const item of cluster) {
    const color = getColor(item, items);
    if (colorMap.has(color)) {
      colorMap.get(color)!.push(item);
    } else {
      colorMap.set(color, [item]);
    }
  }
  const colorGroups: string[][] = Array.from(colorMap.values());
  return colorGroups;
}

/**
 * Groups items within a cluster based on their shape (if available) or type.
 */
function groupByTypes(cluster: string[]): string[][] {
  const typeMap: Map<string, string[]> = new Map();
  for (const id of cluster) {
    const item = items.find((item) => item.id === id);
    if (item) {
      let key = item.type;
      if (item.shape) {
        key = item.shape;
      }
      if (!typeMap.has(key)) {
        typeMap.set(key, []);
      }
      typeMap.get(key)!.push(id);
    }
  }
  return Array.from(typeMap.values());
}

/**
 * Evaluates clusters based on some rule like the evenness of distribution, returning the most relevant clusters.
 * @example
 * color = [1, 1, 1, 3] ==> four colors, each color has 1, 1, 1, 3 items respectively
 * shape = [3, 3]  ==> two shapes, each shape has 3, 3, items respectively
 * the shape groupping result is more relevant
 * @example
 * color = [1, 1, 1, 6] ==> four colors, each color has 1, 1, 1, 6 items respectively
 * shape = [3, 3, 2, 1]  ==> four shapes, each shape has 3, 3, 3, 1 items respectively
 * the shape groupping result is more relevant
 * @returns The most relevant clusters after evaluation and possible merging.
 */
function evaluateClusters(
  colorGroups: string[][],
  typeGroups: string[][]
): string[][] {
  const colorGroupScore = calculateBalanceScore(colorGroups);
  const typeGroupScore = calculateBalanceScore(typeGroups);
  if (colorGroupScore <= typeGroupScore) {
    return colorGroups;
  } else {
    return typeGroups;
  }
}

/**
 * Evaluate the evenness of distribution by considering the variance of subgroup counts.
 */
function calculateBalanceScore(group: string[][]): number {
  let totalItems = 0;
  for (const subGroup of group) {
    totalItems += subGroup.length;
  }
  const idealSubgroupSize = totalItems / group.length;
  let squaredDiffs = 0;
  for (const subGroup of group) {
    squaredDiffs += (subGroup.length - idealSubgroupSize) ** 2;
  }
  return squaredDiffs / group.length;
}

/**
 * Retrieves the color of an item by its ID.
 * @param id the node's id string
 * @param items container stores all the BoardNode objects.
 * @returns The color of the item as a string.
 */
function getColor(id: string): string {
  const item = items.find((item) => item.id === id);
  let color;
  if (item.type === "card") {
    color = GetColorName(item.style.cardTheme);
  } else if (item.type === "shape") {
    color =
      item.style.fillColor !== "transparent"
        ? GetColorName(item.style.fillColor)
        : "Uncolored";
  } else if (item.type === "sticky_note") {
    color = getStickyNoteColor(item.style.fillColor);
  } else if (item.type === "text") {
    color = GetColorName(item.style.color);
  } else {
    color = "Uncolored";
  }
  return color;
}

// helper function for sticky note color
export function getStickyNoteColor(color: string): string {
  for (const item of data) {
    if (item.fillColor === color) {
      return item.color;
    }
  }
}

// helper function to get shape map
// function getShapeGroup(shapes: string[]): string[][] {
//   const shapeMap: Map<string, string[]> = new Map();
//   for (id of shapes) {
//     const item = items.find((item) => item.id === id);
//     if (item.shape in shapeMap) {
//       shapeMap.get(item.shape)?.push(id);
//     } else {
//       shapeMap.set(item.shape, [id]);
//     }
//   }
//   return Array.from(shapeMap.values());
// }
