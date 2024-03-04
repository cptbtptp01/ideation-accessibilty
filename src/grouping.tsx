//@ts-nocheck

import { BoardNode } from "@mirohq/websdk-types";
import { GetColorName } from "hex-color-to-color-name";
import { kMeansClusteringWrapper, } from "./kMeansClustering";

import data from "./data/grouping/stickyColor";

const K_MEANS_THRESHOLD = 5;
const GROUPING_THRESHOLD = 5;
const PARENT_ID_FOR_FLOATING = "floating";
const NO_CONTENT_MSG = "No content available"

// Global variable to make Miro items accessible throughout the file
let items: BoardNode[]; // TODO: Consider to use map

// Sets to store IDs of items based on their categorization
let floatingSet: Set<string> = new Set();
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
  return JSON.stringify(jsonObject, null, 2);
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
  for (const [parentId, cluster] of groupMap) {
    processCluster(Array.from(cluster), parentId, jsonObject);
  }
  processCluster(Array.from(floatingSet), PARENT_ID_FOR_FLOATING, jsonObject);
}

/**
 * Process one array/set and update the jsonObject.
*/
function processCluster(rawInputs: string[], parentId: string, jsonObject: any) {
  const clusters: string[][] = kMeansClusteringWrapper(rawInputs, items); // TODO: handling connectors (maybe later)
  for (const subCluster of clusters) {
    if (subCluster.length > GROUPING_THRESHOLD) { // bigger clusters...
      let colorGroups = groupByColors(subCluster);
      let typeGroups = groupByTypes(subCluster);
      let result = evaluateClusters(colorGroups, typeGroups);
      let largeClusterJsonObject = {};
      for (const itemIds in result) {
        const newObject = createJsonObject(itemIds, parentId); // "content": [json, json, json]
        // add newObject to largeClusterJsonObject;
      }
      // add largeClusterJsonObject to jsonObject

    } else { // smaller clusters... ["id1", "id2",...] -> {"title": "_", "content": ["content1", "content2", ...]}
      const object = createJsonObject(subCluster, parentId)
      // const smallClusterId = `smallCluster_${Object.keys(jsonObject[parentId]).length + 1}`;
      // jsonObject[parentId][smallClusterId] = createJsonObject(subCluster, parentId);
    }
  }
}

/**
 * Generates content in a specified format as an jsonObject.
 * @example
 * {
 *   title: "Cluster Title", // Assuming title is either passed or predefined
 *   content: ["hello", "world", "miro", ...]
 * }
 */
function createJsonObject(cluster: string[], parentId: string) : jsonObject {
  // Get contents
  let contentArray = [];
  for (const id of cluster) {
    const content = getContent(id);
    if (content !== NO_CONTENT_MSG) {
    contentArray.push(content);}
  }

  let newTitle = getTitle(parentId);

  // Construct the object to be added
  const newJsonObject = {
    title: newTitle,
    content: contentArray
  };

  console.error(newJsonObject)
  return newJsonObject;
}

function getContent(id: string): string {
  const item = items.find((item) => item.id === id);
  if (item && item.content) {
    return item.content;
  } else {
    return NO_CONTENT_MSG;
  }
}

function getTitle(parentId: string): string {
  const item = items.find((item) => item.id === parentId);
  if (item && item.title) {
    return item.title;
  } else {
    return NO_CONTENT_MSG;
  }
}

/**
 * Pushes the result (not ids, but the actual text) to the jsonObject.
 * @example
 * {
 * title: "title",
 * content: ["hello", "world", "miro", ...]
 * }
 * @example
 * {
 * title: "title",
 *   content: {
 *     {
 *      title: "title",
 *      content: ["hello", "world", "miro", ...]
 *     },
 *     {
 *      title: "title",
 *      content: content: ["hello", "world", "miro", ...]
 *     }
 *   }
 * }
 */
function pushToJsonObject(clusterResult: string[][], parentId: string, jsonObject: any) {
  const textResult = convertIdsToString(clusterResult, parentId); // Use a different variable name
  if (jsonObject.hasOwnProperty(parentId)) {
    jsonObject[parentId].push(...textResult); // Ensure to spread the array if needed
  } else {
    jsonObject[parentId] = textResult; // Assign as new value
  }
}

/**
 * Convert the IDs to actual text.
 * [["content1", "content2",...], ["content1", "..",...],...]
 */
function convertIdsToString(result: string[][], parentId: string): string[][] {
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[i].length; j++) {
      let item = items.find((item) => item.id === result[i][j]);
      if (item && item.content && item.content !== "") {
        result[i][j] = item.content;
      } else {
        result[i][j] = NO_CONTENT_MSG; // TODO: Better way to handle items with no text?
      }
    }
  }
  return result;
}

/**
 * Clears all containers to prepare for new summarized action.
 */
function cleanAllContainers(): void {
  frameMap.clear();
  groupMap.clear();
  floatingSet.clear();
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
 * Groups items within a cluster based on their type.
 * @param cluster An array of item IDs as strings.
 * @returns A map of type to a list of item IDs.
 * @example
 *  {
 *  "card": ["id1", "id2", ...],
 *  "shape": [["id3", "id4", ...],[...]],
 *  ...
 *  }
 */
function groupByTypes(cluster: string[]): Map<string, string[] | string[][]> {
  const typeMap: Map<string, string[] | string[][]> = new Map(); // todo predefine the map
  for (const id of cluster) {
    const item = items.find((item) => item.id === id);
    if (item) {
      if (item.type in typeMap) {
        typeMap.get(item.type)?.push(id);
      } else {
        typeMap.set(item.type, [id]);
      }
    }
  }
  // get shape group and update the map
  // [id1, id2, id3,...] -> [[id1, id2], [id3, id4], ...]
  // const shapeGroup = getShapeGroup(typeMap.get("shape"));
  // typeMap.set("shape", shapeGroup);

  return typeMap;
}

/**
 * Evaluates clusters based on some rule (TBD), returning the most relevant clusters.
 * @returns The most relevant clusters after evaluation and possible merging.
 */
function evaluateClusters(
  colorGroups: string[][],
  typeGroups: string[][]
): string[][] {
  // TODO - zqy: Implementation
  // Maybe comparing, combining, or selecting clusters based on the evaluation rules
  // For now, just randomly return one of the groups depends on random number
  // get random number of either 0 or 1
  const random = Math.floor(Math.random() * 2);
  if (random === 0) {
    return colorGroups;
  } else {
    return typeGroups;
  }
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
function getShapeGroup(shapes: string[]): string[][] {
  console.log(shapes);
  const shapeMap: Map<string, string[]> = new Map();
  for (id of shapes) {
    const item = items.find((item) => item.id === id);
    if (item.shape in shapeMap) {
      shapeMap.get(item.shape)?.push(id);
    } else {
      shapeMap.set(item.shape, [id]);
    }
  }
  return Array.from(shapeMap.values());
}
