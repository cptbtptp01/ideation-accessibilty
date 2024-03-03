//@ts-nocheck

import { BoardNode } from "@mirohq/websdk-types";
import { GetColorName } from "hex-color-to-color-name";
import { kMeansClusteringWrapper, } from "kMeansClustering";

import data from "./data/grouping/stickyColor";

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
  const clusters: string[][] = kMeansClusteringWrapper(cluster, items);
  // TODO: handling connnectors (maybe later)
  for (const subCluster of clusters) {
    if (subCluster.length > GROUPING_TRHESHOLD) { // bigger clusters...
      const colorGroups = groupByColors(subCluster);
      const typeGroups = groupByTypes(subCluster);
      const result = evaluateClusters(colorGroups, typeGroups);
      if (jsonObject.hasOwnProperty(parentId)) {
        jsonObject[parentId].push(...result); // merge with existing value
      } else {
        jsonObject[parentId] = result; // assign as new value
      }
    } else { // smaller clusters...
      if (jsonObject.hasOwnProperty(parentId)) {
        jsonObject[parentId].push(subCluster); // merge with existing value
      } else {
        jsonObject[parentId] = [subCluster]; // assign as new value
      }
    }
  }
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

//   // todo(hy): confirm the logic for floatingSet, use clusterByDistance
//   // todo(hy): if connectors are present, nodes are put into one cluster
//   // frameSet does not have parentId

/**
 * Groups items within a cluster based on their color.
 * @param cluster A set of item IDs as strings.
 * @returns A map of color to a list of item IDs.
 */
export function groupByColors(cluster: string[]): Map<string, Set<string>> {
  let colorMap: Map<string, Set<string>> = new Map();
  cluster.forEach((item) => {
    const color = getColor(item, items);
    if (colorMap.has(color)) {
      colorMap.get(color)!.add(item);
    } else {
      colorMap.set(color, new Set([item]));
    }
    return colorMap;
  });
  return colorMap;
}

/**
 * Groups items within a cluster based on their type.
 * @param cluster An array of item IDs as strings.
 * @returns A map of type to a list of item IDs.
 * @example
 *  {
 *  "card": ["id1", "id2", ...],
 *  "shape": ["id3", "id4", ...],
 *  ...
 *  }
 */
function groupByTypes(cluster: string[]): Map<string, string[]> {
  const typeMap: Map<string, string[]> = new Map();
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
