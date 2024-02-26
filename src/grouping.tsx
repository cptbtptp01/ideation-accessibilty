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

export async function groupItems() { // Need to specify the return type
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

// ------------------- Major Functions --------------------------

function cleanAllContainers() {
    // Clears all data structures to prepare for new clustering
}

function preprocessingByType() {
    // Organizes items into sets and maps based on their type
}

function clusterByType() {
    // Clusters items by their type, considering groups and frames as pre-defined clusters
}

function clusterByDistance() {
    // Clusters items based on their spatial distance
}

function groupByColors(cluster) {
    // Groups items within a cluster based on their color
}

function groupByTypes(cluster) {
    // Groups items within a cluster based on their type
}

function evaluateClusters(colorGroups, typeGroups) {
    // Evaluates and merges clusters based on some criteria, returning the most relevant clusters
}

// ------------------- Helpers --------------------------

function getColor(id: string) {
    // Retrieves the color of an item by its ID
}

function getLocation(id: string) {
    // Calculates and returns the central coordinate of an item
}