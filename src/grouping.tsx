//@ts-nocheck

import { BoardNode } from "@mirohq/websdk-types";
import { GetColorName } from "hex-color-to-color-name";
import { kMeansClusteringWrapper, } from "kMeansClustering";

import data from "./data/grouping/stickyColor";
import { get } from "http";

const K_MEANS_TRHESHOLD = 5;
const GROUPING_TRHESHOLD = 5;
const PARENT_ID_FOR_FLOATING = "floating";

// Global variable to make Miro items accessible throughout the file
let items: BoardNode[];

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
function processCluster(cluster: string[][], parentId: string, jsonObject: any) {
  const clusters: string[][] = kMeansClusteringWrapper(cluster, items); // TODO: handling connnectors (maybe later)
  for (const subCluster of clusters) {
    if (subCluster.length > GROUPING_TRHESHOLD) { // bigger clusters...
      const colorGroups = groupByColors(subCluster);
      const typeGroups = groupByTypes(subCluster);
      const result = evaluateClusters(colorGroups, typeGroups);
      pushToJsonObject(result, parentId, jsonObject);
    } else { // smaller clusters...
      pushToJsonObject(subCluster, parentId, jsonObject);
    }
  }
}

/**
 * Pushes the result (not ids, but the actual text) to the jsonObject.
 */
function pushToJsonObject(result: string[][], parentId: string, jsonObject: any) {
  const result = convertIdsToString(result, parentId); // TODO: type tbd
  if (jsonObject.hasOwnProperty(parentId)) {
    jsonObject[parentId].push(result); // merge with existing value
  } else {
    jsonObject[parentId] = result; // assign as new value
  }
}

/**
 * Convert the IDs to actual text.
 */
function convertIdsToString(result: string[][], parentId: string): string[][]{
  // TODO: implementation to be refined
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[i].length; j++) {
      result[i][j] = items.find((item) => item.id === result[i][j]).text;
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
  frameSet.clear();
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
  const typeMap: Map<string, string[]|string[][]> = new Map();
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
  const shapeGroup = getShapeGroup(typeMap.get("shape"));
  typeMap.set("shape", shapeGroup);

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
  // TODO: Impl
  // Maybe comparing, combining, or selecting clusters based on the evaluation rules
  return [];
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
