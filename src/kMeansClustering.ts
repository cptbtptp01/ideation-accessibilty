//@ts-nocheck
import { BoardNode } from "@mirohq/websdk-types";
import { items } from "./grouping";

const MAX_ITERATIONS = 100;
const REPEATING_TIMES_PER_K = 5;
const ESTIMATED_NODES_PER_CLUSTER = 3;

export interface DataPoint {
  // only used locally in kMeansClustering
  id: string;
  x: number;
  y: number;
}

/**
 * Wrapper function for k-means clustering.
 * @param ids - the IDs of the items to be clustered.
 * @returns an array of clusters, where each cluster is an array of item IDs.
 */
function kMeansClusteringWrapper(
  ids: string[],
  items: BoardNode[]
): string[][] {
  // Data type convertion for ease of processing
  const dataPoints = convertToDataPoints(ids, items);

  // Get output using k-means clustering with the elbow method (picking optimal k)
  const [centroids, assignments] = elbowMethod(dataPoints);

  // Convert output to final output string[][]
  const clusters: string[][] = new Array(centroids.length)
    .fill(0)
    .map(() => []);
  assignments.forEach((clusterIndex, i) => {
    clusters[clusterIndex].push(dataPoints[i].id);
  });
  return clusters;
}

/**
 * Chooses the optimal k-means clustering using the elbow method.
 * @returns the optimal number of clusters (k) as a number.
 */
function elbowMethod(dataPoints: DataPoint[]): [DataPoint[], number[]] {
  let maxK = dataPoints.length / ESTIMATED_NODES_PER_CLUSTER + 1;
  let distortions = [];

  for (let k = 1; k <= maxK; k++) {
    let [centroids, assignments] = runKMeansForNTimes(dataPoints, k);
    let distortion = getMeanSquaredDistance(dataPoints, centroids, assignments);
    distortions.push(distortion);
  }

  let optimalK = 0;
  let maxDistortionChange = 0;
  for (let i = 1; i < distortions.length; i++) {
    let distortionChange = Math.abs(distortions[i] - distortions[i - 1]);
    if (distortionChange > maxDistortionChange) {
      maxDistortionChange = distortionChange;
      optimalK = i;
    }
  }

  return kMeansClustering(dataPoints, optimalK);
}

/**
 * Runs k-means clustering for n times and returns the best result.
 */
function runKMeansForNTimes(
  dataPoints: DataPoint[],
  k: number,
  n: number = REPEATING_TIMES_PER_K
): [DataPoint[], number[]] {
  let bestCentroids: DataPoint[] = [];
  let bestAssignments: number[] = [];
  let lowestTotalDistance = Infinity;

  for (let i = 0; i < n; i++) {
    let [centroids, assignments] = kMeansClustering(dataPoints, k);
    let totalDistance = calculateTotalDistance(
      dataPoints,
      centroids,
      assignments
    );

    if (totalDistance < lowestTotalDistance) {
      lowestTotalDistance = totalDistance;
      bestCentroids = centroids;
      bestAssignments = assignments;
    }
  }

  return [bestCentroids, bestAssignments];
}

/**
 * Implementation of k-means clustering that groups "nodes" into "k" clusters based on their (x, y) coordinates.
 */
function kMeansClustering(
  dataPoints: DataPoint[],
  k: number
): [DataPoint[], number[]] {
  if (k <= 0 || dataPoints.length < k) {
    return [[], []];
  }

  // Ramdomly initialize the centroids
  let centroids: DataPoint[] = initalizeCentroids(k, dataPoints);
  let assignments: number[] = new Array(dataPoints.length).fill(-1);
  let iterations = MAX_ITERATIONS;
  let clusterChanged = 0;

  // Aiisgns each data point to the closest centroid
  do {
    clusterChanged = assignItemsToClusters(dataPoints, centroids, assignments);
    recalculateCentroids(dataPoints, centroids, assignments, k);
  } while (clusterChanged > 0 && iterations-- > 0);

  return [centroids, assignments];
}

/**
 * Evaluates the k-means clustering by calculating the MSD of each data point to its assigned centroid.
 */
function getMeanSquaredDistance(
  dataPoints: DataPoint[],
  centroids: DataPoint[],
  assignments: number[]
): number {
  let totalDistance = 0;
  dataPoints.forEach((point, i) => {
    let centroid = centroids[assignments[i]];
    totalDistance += Math.pow(point.x - centroid.x, 2);
    totalDistance += Math.pow(point.y - centroid.y, 2);
  });
  return totalDistance;
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
      // Use a random point as the centroid if the cluster is empty
      let randomIndex = Math.floor(Math.random() * dataPoints.length);
      centroids[i].x = dataPoints[randomIndex].x;
      centroids[i].y = dataPoints[randomIndex].y;
    } else {
      centroids[i].x = sum.x / sum.count;
      centroids[i].y = sum.y / sum.count;
    }
  });
}

/**
 * Converts the IDs into an array of ClusterItems.
 */
export function convertToDataPoints(ids: string[], items: any): DataPoint[] {
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
export function getLocation(id: string, items: any): [number, number] {
  const item = items.find((item) => item.id === id);
  if (item && item.x && item.y && item.width && item.height) {
    const centerX = item.x + item.width / 2;
    const centerY = item.y + item.height / 2;
    const roundedX = Number(centerX.toFixed(2));
    const roundedY = Number(centerY.toFixed(2));
    return [roundedX, roundedY];
  } else if (item) {
    return [0, 0];
  } else {
    return [0, 0];
  }
}
