import { BoardNode } from "@mirohq/websdk-types";

const EPSILON = 0.01;
const MAX_ITERATIONS = 100;

interface DataPoint {
  // only used locally in kMeansClustering
  id: string;
  x: number;
  y: number;
}

// TODO: convert ids to dataPoints

/**
 * Implementation of k-means clustering that groups "nodes" into "k" clusters based on their (x, y) coordinates.
 */
function kMeansClustering(dataPoints: DataPoint[], k: number): string[][] {
  if (k <= 0 || dataPoints.length < k) {
    return [];
  }

  // Ramdomly initialize the centroids
  let centroids: DataPoint[] = initalizeCentroids(k, dataPoints);
  let assignments: number[] = new Array(dataPoints.length).fill(-1);
  let clusterChanged = 0;

  // Aiisgns each data point to the closest centroid
  do {
    clusterChanged = assignItemsToClusters(dataPoints, centroids, assignments);
    recalculateCentroids(dataPoints, centroids, assignments, k);
  } while (clusterChanged > 0);

  // Group items by cluster for the final output
  let clusters: string[][] = new Array(k).fill(0).map(() => []);
  assignments.forEach((clusterIndex, i) => {
    clusters[clusterIndex].push(dataPoints[i].id);
  });

  return clusters;
}

// ------------------------------------------ HELPERS ------------------------------------------

/**
 * Converts the IDs into an array of ClusterItems.
 */
function convertToClusterItems(ids: string[], items: BoardNode[]): DataPoint[] {
  const res: DataPoint[] = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const location: [number, number] = getLocation(id, items);
    if (location[0] !== 0 || location[1] !== 0) {
      res.push({ id, x: location[0], y: location[1] });
    }
  }
  return res;
}

/**
 * Calculates and returns the central coordinates of an item.
 */
export function getLocation(id: string, items: BoardNode[]): [number, number] {
  const item = items.find((item) => item.id === id);
  if (item && item.width && item.height) {
    return [item.x + item.width / 2, item.y + item.height / 2];
  } else if (item) {
    console.error(
      `getLocation: Item with ID ${id} does not have 'width' or 'height' properties.`
    );
    return [0, 0];
  } else {
    console.error(`getLocation: Item with ID ${id} not found.`);
    return [0, 0];
  }
}

/**
 * Randomly selects "k" data points to be the initial centroids.
 */
function initalizeCentroids(k: number, dataPoints: DataPoint[]): DataPoint[] {
  let shuffled = [...dataPoints].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, k);
}

/**
 * Assigns each data point to the closest centroid.
 */
function assignItemsToClusters(
  dataPoints: DataPoint[],
  centroids: DataPoint[],
  assignments: number[]
): number {
  let changes = 0;

  // for each data point, find the closest centroid
  dataPoints.forEach((point, i) => {
    let minDistance = Number.MAX_VALUE;
    let clusterIndex = -1;
    centroids.forEach((centroid, j) => {
      let distance = Math.sqrt(
        Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        clusterIndex = j;
      }
    });

    // if the data point is assigned to a different cluster, update changes
    if (assignments[i] !== clusterIndex) {
      assignments[i] = clusterIndex;
      changes++;
    }
  });
  return changes;
}

/**
 * Calculates the new centroids based on the updated assignments.
 */
function recalculateCentroids(
  dataPoints: DataPoint[],
  centroids: DataPoint[],
  assignments: number[],
  k: number
) {
  let sums = new Array(k).fill(0).map(() => ({ x: 0, y: 0, count: 0 }));
  dataPoints.forEach((point, i) => {
    // get total for each cluster
    let clusterIndex = assignments[i];
    sums[clusterIndex].x += point.x;
    sums[clusterIndex].y += point.y;
    sums[clusterIndex].count++;
  });
  // get average i.e. new centroid of each cluster
  sums.forEach((sum, i) => {
    if (sum.count === 0) {
      centroids[i].x = 0;
      centroids[i].y = 0;
    } else {
      centroids[i].x = sum.x / sum.count;
      centroids[i].y = sum.y / sum.count;
    }
  });
}
