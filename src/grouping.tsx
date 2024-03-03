//@ts-nocheck

import { BoardNode } from "@mirohq/websdk-types";
import { GetColorName } from "hex-color-to-color-name";

import data from "./data/grouping/stickyColor";

// ------------------------------------------------------------ Data Structure ----------------------------------------------------------

// Global variable to make Miro items accessible throughout the file
let items: BoardNode[];
export { items };

// Sets to store IDs of items based on their categorization
let frameSet: Set<string> = new Set();
let groupSet: Set<string> = new Set();
let floatingSet: Set<string> = new Set();

// Maps and Sets to organize items by their characteristics
// TODO - zqy: Remove unused containers
let imageSet: Set<string> = new Set();
let shapeSet: Set<string> = new Set(); // hold all shapes regardless of form
let shapeMap: Map<string, Set<string>> = new Map();
let stickyNoteSet: Set<string> = new Set();
let cardSet: Set<string> = new Set();
let textSet: Set<string> = new Set();
let connectorSet: Set<string> = new Set();

// ------------------------------------------------------------ Key Logic ------------------------------------------------------------

/**
 * Groups Miro board items into clusters based on predefined criteria including type, proximity, color, and other attributes.
 * This function shows the entire clustering process, starting from fetching board items to returning a structured collection of item clusters.
 *
 * Process Flow:
 * 1. Fetch all items from the Miro board.
 * 2. Initialize or reset data structures to hold the categorization and clustering of items.
 * 3. Categorize items by their type (e.g., frame, group, floating) to form initial clusters.
 *    - For floating items, apply spatial clustering based on distance to further refine clusters.
 *    - Cornor case: Impl TBD: if connectors are present, nodes are put into one cluster.
 * 4. Evaluate each cluster's size and, if necessary, further break down this clusters into smaller groups based on color and type.
 *    - Merge or adjust clusters based on evaluation criteria to form the final set of clusters.
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
  // Each cluster can be List[id] or List[List[id]].
  // TODO: See if the data structure needs to be updated.
  let finalClusters = [];

  for (const [parentId, cluster] of initialClusters) {
    // tbd, in case we need parent information in final output
    console.log("parentId: ", parentId);
    if (cluster.size > threshold) {
      const colorGroups = groupByColors(cluster); // Further categorizes items within a cluster by color.
      const typeGroups = groupByTypes(cluster); // Further categorizes items within a cluster by type.
      const result = evaluateClusters(colorGroups, typeGroups); // Evaluates and determine the final clusters to use.
      finalClusters.push(...result);
    } else {
      finalClusters.push(cluster); // Smaller clusters are pushed directly without further categorization.
    }
  }

  return finalClusters; // Returns the structured clusters.
}

// ------------------------------------------------------------ Major Functions ------------------------------------------------------------

/**
 * Implementation will reset global data structures such as frameSet, groupSet, etc.
 */
function cleanAllContainers(): void {
  // Clears all data structures to prepare for new clustering
  frameSet.clear();
  groupSet.clear();
  floatingSet.clear();
  imageSet.clear();
  shapeSet.clear();
  shapeMap.clear();
  stickyNoteSet.clear();
  cardSet.clear();
  textSet.clear();
  connectorSet.clear();
}

/**
 * Organizes board items into categorized containers.
 * This might involve populating global sets and maps with item IDs.
 */
function allocateToContainers(): void { // TODO - zqy: To be refactored
  for (const item of items) {
    if (item.type === "frame") {
      frameSet.add(item.id);
    } else if (item.type === "group") {
      groupSet.add(item.id);
    } else {
      floatingSet.add(item.id);
      allocateByTypeHelper(item);
    }
  }
}

/**
 * Helper function to allocate items to their respective containers based on type.
 */
function allocateByTypeHelper(item: BoardNode): void {
  if (item.type === "image") {
    imageSet.add(item.id);
  }
  if (item.type === "shape") {
    shapeSet.add(item.id);
    const shape = item.shape;
    if (shape in shapeMap) {
      shapeMap.get(shape)?.add(item.id);
    } else {
      shapeMap.set(shape, new Set([item.id]));
    }
  }
  if (item.type === "sticky_note") {
    stickyNoteSet.add(item.id);
  }
  if (item.type === "card") {
    cardSet.add(item.id);
  }
  if (item.type === "text") {
    textSet.add(item.id);
  }
  if (item.type === "connector") {
    connectorSet.add(item.id);
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
 * Clusters items based on spatial proximity.
 * @returns A list of clusters, each cluster containing item IDs based on proximity.
 */
function clusterByDistance(initialCluster: string[]): string[][] {
  // Implementation will cluster floating items based on spatial proximity.
  return []; // Placeholder return
}

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

// todo(hy) may need a helper to handle further clustering shapes by form
