//@ts-nocheck

import { BoardNode } from "@mirohq/websdk-types";
import { GetColorName } from "hex-color-to-color-name";
import { kMeansClusteringWrapper, } from "kMeansClustering";

import data from "./data/grouping/stickyColor";

const K_MEANS_TRHESHOLD = 5;
const GROUPING_TRHESHOLD = 5;

// Global variable to make Miro items accessible throughout the file
let items: BoardNode[];

// Sets to store IDs of items based on their categorization
// let frameSet: Set<string> = new Set();
// let groupSet: Set<string> = new Set();
let floatingSet: Set<string> = new Set();
let frameMap: Map<string, Set<string>> = new Map();
let groupMap: Map<string, Set<string>> = new Map();

// Maps and Sets to organize items by their characteristics
// TODO - zqy: Remove unused containers
// let imageSet: Set<string> = new Set();
// let shapeSet: Set<string> = new Set(); // hold all shapes regardless of form
// let shapeMap: Map<string, Set<string>> = new Map();
// let stickyNoteSet: Set<string> = new Set();
// let cardSet: Set<string> = new Set();
// let textSet: Set<string> = new Set();
// let connectorSet: Set<string> = new Set();

/**
 * Groups Miro board items by rule based algorithm.
 *
 * Process Flow:
 * 1. Fetch all items from the Miro board.
 * 2. Initialize or reset data structures to hold the categorization and clustering of items.
 * 3. Categorize items by their type (e.g., frame, group, floating).
 *    - For floating items, apply spatial clustering based on distance to further refine clusters.
 *    - Cornor case: Impl TBD: if connectors are present, nodes are put into one cluster.
 * 4. Check cluster size and, if necessary, further break down this cluster into smaller groups based on color and type.
 *    - Merge or adjust clusters based on predefined evaluation criteria.
 *
 * @returns json, TBD...
 */
export async function groupItems() {
  // TODO: Specify the return type
  items = await miro.board.get(); // Fetches all board items.

  cleanAllContainers(); // Resets all containers for a fresh start.

  allocateToContainers(); // Sorts items into initial categories based on type.

  const initialClusters = clusterByParent(); // Forms initial clusters based on item types.

  // Initializes the array to hold the final clusters.
  // TODO: See if the data structure needs to be updated.
  let finalRes = [];

  for (const [parentId, cluster] of initialClusters) {
    // tbd, in case we need parent information in final output
    console.log("parentId: ", parentId);
    if (cluster.size > GROUPING_TRHESHOLD) {
      const colorGroups = groupByColors(cluster);
      const typeGroups = groupByTypes(cluster);
      const result = evaluateClusters(colorGroups, typeGroups);
      finalRes.push(...result);
    } else {
      finalRes.push(cluster); // Smaller clusters...
    }
  }

  return finalRes; // Returns the structured clusters.
}

/**
 * Clears all containers to prepare for new summarized action.
 */
function cleanAllContainers(): void {// TODO: Remove unused containers
  frameMap.clear();
  groupMap.clear();
  frameSet.clear();
  // frameSet.clear();
  // groupSet.clear();
  // floatingSet.clear();
  // imageSet.clear();
  // shapeSet.clear();
  // shapeMap.clear();
  // stickyNoteSet.clear();
  // cardSet.clear();
  // textSet.clear();
  // connectorSet.clear();
}

/**
 * Organizes board items into categorized containers.
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
 * Further allocate floating items to their respective type containers.
 */
function allocateByTypeHelper(item: BoardNode): void {
  if (item.type === "shape") {
    shapeSet.add(item.id);
    const shape = item.shape;
    if (shape in shapeMap) {
      shapeMap.get(shape)?.add(item.id);
    } else {
      shapeMap.set(shape, new Set([item.id]));
    }
  } else {
    const typeSet = `${item.type}Set`;
    if (typeof this[typeSet] !== "undefined") {
      this[typeSet].add(item.id);
    } else {
      // Track types we are not handling
      console.error("Item type not supported: ", item.type);
    }
  }
}

/**
 * Clusters board items by group, frame, floating, considering groups and frames as predefined clusters.
 * Floating items are clustered based on proximity using clusterByDistance.
 *
 * @returns A map of clusters, with keys as parentIDs, and values as maps of item types to item IDs.
 * @example
 * {
 *  "frameId1": ["id1", "id2", ...],
 *  "frameId2": ["id3", "id4", ...],
 *  "groupId1": ["id5", "id6", ...],
 *  ...
 * }
 */
function clusterByParent(): Map<string, string[]> {
  const clusters: Map<string, string[]> = new Map();

  if (frameSet.size > 0) {
    for (const parentId of frameSet) {
      const parent = items.find((item) => item.id === parentId);
      const childrenIds = parent.childrenIds;
      clusters.set(parentId, childrenIds);
    }
  }

  if (groupSet.size > 0) {
    for (const parentId of groupSet) {
      const parent = items.find((item) => item.id === parentId);
      const childrenIds = parent.itemsIds;
      clusters.set(parentId, childrenIds);
    }
  }

  // todo(hy): confirm the logic for floatingSet, use clusterByDistance
  // todo(hy): if connectors are present, nodes are put into one cluster
  // frameSet does not have parentId

  return clusters;
};

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
  // Impl
  // Maybe comparing, combining, or selecting clusters based on the evaluation rules
  return [];
}

// ------------------------------------------------------------ Helpers ------------------------------------------------------------

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

// todo(hy) may need a helper to handle further grouping shapes by form
