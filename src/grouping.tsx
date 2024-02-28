//@ts-nocheck

import { BoardNode } from "@mirohq/websdk-types";
import { GetColorName } from "hex-color-to-color-name";

import data from "./data/grouping/stickyColor";

// ------------------------------------------------------------ Data Structure ----------------------------------------------------------

// Global variable to make Miro items accessible throughout the file
let items: BoardNode[];

// Sets to store IDs of items based on their categorization
let frameSet: Set<string> = new Set();
let groupSet: Set<string> = new Set();
let floatingSet: Set<string> = new Set();

// Maps and Sets to organize items by their characteristics
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

  preprocessingByType(); // Sorts items into initial categories based on type.

  const initialClusters = clusterByType(); // Forms initial clusters based on item types.

  // Initializes the array to hold the final clusters.
  // Each cluster can be List[id] or List[List[id]].
  // TODO: See if the data structure needs to be updated.
  let finalClusters = [];

  // Further categorizes and evaluates the initial clusters
  for (const cluster of initialClusters) {
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
}

/**
 * Organizes board items into categorized containers based on their type.
 * This might involve populating global sets and maps with item IDs.
 */
function preprocessingByType(): void {
  // Organizes items into sets and maps based on their type
}

/**
 * Initial clustering
 * Clusters board items by group, frame, floating, considering groups and frames as predefined clusters.
 * Floating items are clustered based on proximity using clusterByDistance.
 */
function clusterByType(): void {
  items.forEach((item) => {
    if (item.type === "frame") {
      frameSet.add(item.id);
    } else if (item.type === "group") {
      groupSet.add(item.id);
    } else {
      // tbd for future implementation
      floatingSet.add(item.id);
    }
  });
};

/**
 * Clusters items based on spatial proximity.
 * @returns A list of clusters, each cluster containing item IDs based on proximity.
 */
function clusterByDistance(): string[][] {
  // Implementation will cluster floating items based on spatial proximity.
  return []; // Placeholder return
}

/**
 * Groups items within a cluster based on their color.
 * @param cluster An array of item IDs as strings.
 * @returns A map of color to a list of item IDs.
 */
export function groupByColors(cluster: string[]):Map<string, Set<string>>{
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
 * @returns A list of clusters, each cluster is a list of item IDs.
 */
function groupByTypes(cluster: string[]): string[][] {
  // Implementation here...
  return [];
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
export function getColor(id: string, items): string {
  const item = items.find((item) => item.id === id);
  let color;
  if (item.type === "card") {
    color = GetColorName(item.style.cardTheme);
  } else if (item.type === "shape") {
    color = item.style.fillColor !== "transparent"
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

/**
 * Calculates and returns the central coordinate of an item.
 * @returns A tuple representing the central coordinate (x, y) of the item.
 */
export function getLocation(id: string, items): [number, number] {
  const item = items.find((item) => item.id === id);
  if (item && item.width && item.height) {
    return [item.x + item.width / 2, item.y + item.height / 2];
  } else if (item) {
    console.error(
      `getLocation: Item with ID ${id} does not have width or height property.`
    );
    return [0, 0];
  } else {
    console.error(`getLocation: Item with ID ${id} not found.`);
    return [0, 0];
  }
}

// For purpose of testing only, to be deleted
export function add(a: number, b: number): number {
  return a + b;
}

// helper function for sticky note color
export function getStickyNoteColor(color:string):string {
  for (const item of data) {
    if (item.fillColor === color) {
      return item.color;
    }
  }
}

// ------------------------------------------------------------ OLD ------------------------------------------------------------

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

export async function groupItems() {
  const items = await miro.board.get();
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
