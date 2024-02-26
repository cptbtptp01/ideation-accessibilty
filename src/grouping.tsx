import { BoardNode } from "@mirohq/websdk-types";
import { GetColorName } from "hex-color-to-color-name";

/**
 * ------------------------------------------------------------
 * Data Structures to support the clustering logic
 * Unused structures can be removed after evaluation
 * ------------------------------------------------------------
 */

// Global variable to make Miro items accessible throughout the file
let items: BoardNode[];

// Sets to store IDs of items based on their categorization
let frameSet: Set<string> = new Set(); // To store IDs of items that belong to a frame
let groupSet: Set<string> = new Set(); // To store IDs of items that belong to a group
let floatingSet: Set<string> = new Set(); // To store IDs of items not in a frame or group

// Maps and Sets to organize items by their characteristics
let shapeMap: Map<string, Set<string>> = new Map(); // To store IDs of items with the same shape
let stickyNoteSet: Set<string> = new Set(); // To store IDs of sticky note items
let cardSet: Set<string> = new Set(); // To store IDs of card items
let textSet: Set<string> = new Set(); // To store IDs of text items
let connectorSet: Set<string> = new Set(); // To store IDs of connector items


// ------------------ Key Logic ------------------------------

export async function groupItems() { // TODO: Specify the return type
    items = await miro.board.get(); // BoardNode[]

    // Processing: Clear all the containers for a fresh start
    cleanAllContainers(); // void function

    // Preprocesin: Sort items into containers by type
    preprocessingByType(); // void function

    // Clustering by type (group / frame / floating) and distance (if applicable)
    // output: an array of large clusters (may need to be further clustered)
    // returns an array / a map of clusters - map key will be the summary of the cluster
    clusterByType() {
        // for frame, group: no ops, default to be one cluster
        // for floating: need to go through clusterByDistance() one to get clusters
    }

    // Further categorized into smaller groups by grouping items by color and type
    // output: the original one large cluster may become an array of smaller clusters
    const finalClusters; // To hold the final clusters, data structure TBD
    for (const cluster of clusters) {
        if (cluster.size > threshold) {
            const colorGroups = groupByColors(cluster);
            const typeGroups = groupByTypes(cluster);
            const result = evaluateClusters(colorGroups, typeGroups);
            finalClusters.push(result);
        } else {
            finalClusters.push(cluster);
        }
    }

    return finalClusters; // Return the structured clusters as JSON
}

/**
 * Groups Miro board items into clusters based on predefined criteria including type, proximity, color, and other attributes.
 * This function shows the entire clustering process, starting from fetching board items to returning a structured collection of item clusters.
 * 
 * Process Flow:
 * 1. Fetch all items from the Miro board.
 * 2. Initialize or reset data structures to hold the categorization and clustering of items.
 * 3. Categorize items by their type (e.g., frame, group, floating) to form initial clusters.
 *    - For floating items, apply spatial clustering based on distance to further refine clusters.
 * 4. Evaluate each cluster's size and, if necessary, further break down this clusters into smaller groups based on color and type.
 *    - Merge or adjust clusters based on evaluation criteria to form the final set of clusters.
 * 
 * @returns json, TBD...
 */
export async function groupItems() { // TODO: Specify the return type
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

// ------------------- Major Functions --------------------------

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
 * Clusters board items by their type, considering groups and frames as predefined clusters.
 * Floating items are clustered based on proximity using clusterByDistance.
 */
function clusterByType(): void {
    // for frame, group: no ops, default to be one cluster
    // for floating: need to go through clusterByDistance() one to get clusters
}

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
 * @returns A list of clusters, each cluster is a list of item IDs.
 */
function groupByColors(cluster: string[]): string[][] {
    // Implementation here...
    return [];
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
 * @param colorGroups A list of clusters, each cluster is a list of item IDs, grouped by color.
 * @param typeGroups A list of clusters, each cluster is a list of item IDs, grouped by type.
 * @returns The most relevant clusters after evaluation and possible merging.
 */
function evaluateClusters(colorGroups: string[][], typeGroups: string[][]): string[][] {
    // Impl
    // Maybe comparing, combining, or selecting clusters based on the evaluation rules
    return [];
}

// ------------------- Helpers --------------------------

/**
 * Retrieves the color of an item by its ID.
 * @param id The ID of the item as a string.
 * @returns The color of the item as a string.
 */
function getColor(id: string): string {
    // Impl
    return "";
}

/**
 * Calculates and returns the central coordinate of an item.
 * @param id The ID of the item as a string.
 * @returns A tuple representing the central coordinate (x, y) of the item.
 */
function getLocation(id: string): [number, number] {
    // Impl
    return [0, 0];
}