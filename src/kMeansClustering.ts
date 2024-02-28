interface ClusterItem {
  // only used locally in kMeansClustering
  id: string;
  x: number;
  y: number;
}

function kMeansClustering(k: number, ids: string[], items: any): string[][] {
  // Implementation of k-means clustering that groups `items` into `k` clusters
  // based on their (x, y) coordinates.
  let clusterItems: ClusterItem[] = convertToClusterItems(ids, items);
  if (clusterItems.length === 0) {
    return [];
  }
  return [];
}

/**
 * Converts the IDs into an array of ClusterItems.
 */
function convertToClusterItems(ids: string[], items: any[]): ClusterItem[] {
  const res: ClusterItem[] = [];
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
export function getLocation(id: string, items: any[]): [number, number] {
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
