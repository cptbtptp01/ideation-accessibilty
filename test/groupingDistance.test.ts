import {
  DataPoint,
  convertToDataPoints,
  getLocation,
  recalculateCentroids,
  assignItemsToClusters,
  initalizeCentroids,
  getMeanSquaredDistance,
  runKMeansForNTimes,
  // kMeansClustering,
  // recalculateCentroids,
  // elbowMethod,
} from "../src/kMeansClustering";

const testConnector1 = {
  type: "connector", // check
  id: "102", // check
  style: {
    startStrokeCap: "none",
    endStrokeCap: "rounded_stealth",
    strokeStyle: "normal",
    strokeWidth: 2,
    strokeColor: "#333333",
    color: "#1a1a1a",
    textOrientation: "horizontal",
  },
  start: {
    item: "123456789",
    position: {
      x: 1,
      y: 0.5,
    },
    snapTo: "right",
  },
  end: {
    item: "anotherItemId",
    position: {
      x: 0,
      y: 0.5,
    },
    snapTo: "left",
  },
  captions: [],
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-26T07:13:30.464Z",
  createdBy: "3458764561136524777",
  modifiedAt: "2024-02-26T07:13:30.464Z",
  modifiedBy: "3458764561136524777",
};

const testStickyNote1 = {
  type: "sticky_note",
  id: "101",
  x: 100.0,
  y: 200.0,
  width: 39.99999,
  height: 50.00008,
};

const testStickyNote2 = {
  type: "sticky_note",
  id: "3458764579564312953",
  x: 4869.786152,
  y: 2504.686165,
  width: 762.159191,
  height: 873.2276158,
};

const testStickyNote3 = {
  type: "sticky_note",
  id: "3458764580516886689",
  x: -2712.800224,
  y: 1409.030165,
  width: 212.93,
  height: 243.96,
};

const mockItems1 = [testStickyNote1, testConnector1];

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("101", mockItems1)).toEqual([120.0, 225.0]);
  });
});

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("102", mockItems1)).toEqual([0, 0]);
  });
});

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("999", mockItems1)).toEqual([0, 0]);
  });
});

const mockItems2 = [
  testStickyNote1,
  testStickyNote2,
  testStickyNote3,
  testConnector1,
];

describe("convertToDataPoints function", () => {
  it("should return an array of DataPoint objects", () => {
    const ids = ["101", "102", "3458764579564312953", "3458764580516886689"];
    const dp1: DataPoint = {
      id: "101",
      x: 120,
      y: 225,
    };
    const dp2: DataPoint = {
      id: "3458764579564312953",
      x: 5250.87,
      y: 2941.3,
    };
    const dp3: DataPoint = {
      id: "3458764580516886689",
      x: -2606.34,
      y: 1531.01,
    };
    // Connector shall be exclued from the result
    const res: DataPoint[] = [dp1, dp2, dp3];
    expect(convertToDataPoints(ids, mockItems2)).toEqual(res);
  });
});

const dp1: DataPoint = { id: "1001", x: 66.63, y: 66.02 };
const dp2: DataPoint = { id: "1002", x: 74.67, y: 71.53 };
const dp3: DataPoint = { id: "1003", x: 73.71, y: 70.52 };
const dp4: DataPoint = { id: "1004", x: 71.28, y: 67.28 };
const dp5: DataPoint = { id: "1005", x: 42.83, y: 46.69 };
const dp6: DataPoint = { id: "1006", x: 46.38, y: 41.5 };
const dp7: DataPoint = { id: "1007", x: 43.93, y: 48.3 };
const dp8: DataPoint = { id: "1008", x: 43.4, y: 44.2 };
const dp9: DataPoint = { id: "1009", x: 44.9, y: 49.45 };
const dp10: DataPoint = { id: "1010", x: 15.2, y: 14.45 };
const dp11: DataPoint = { id: "1011", x: 13.71, y: 18.75 };
const dp12: DataPoint = { id: "1012", x: 15.15, y: 12.87 };
const dp13: DataPoint = { id: "1013", x: 12.08, y: 12.85 };
const dp14: DataPoint = { id: "1014", x: 16.98, y: 17.03 };
const dp15: DataPoint = { id: "1015", x: 14.7, y: 20.3 };

const dataPoints = [
  dp1,
  dp2,
  dp3,
  dp4,
  dp5,
  dp6,
  dp7,
  dp8,
  dp9,
  dp10,
  dp11,
  dp12,
  dp13,
  dp14,
  dp15,
];

describe("recalculateCentroids function", () => {
  it("recalculateCentroids normal case", () => {
    const dataPointsDeepCopy = dataPoints.map((dp) => ({ ...dp }));
    const initialCentroids: DataPoint[] = [dp2, dp7, dp14];
    const centroids = initialCentroids.map((c) => ({ ...c }));
    const assignments = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
    const k = 3;

    // res
    const resDp2: DataPoint = { id: "1002", x: 71.57, y: 68.84 };
    const resDp7: DataPoint = { id: "1007", x: 44.29, y: 46.03 };
    const resDp14: DataPoint = { id: "1014", x: 14.64, y: 16.04 };
    const res: DataPoint[] = [resDp2, resDp7, resDp14];

    // void function, update centroids in place and does not change dataPoints
    recalculateCentroids(dataPoints, centroids, assignments, k);
    expect(centroids).toEqual(res);
    expect(dataPoints).toEqual(dataPointsDeepCopy);
  });
});

describe("assignItemsToClusters function", () => {
  it("assignItemsToClusters description", () => {
    const dataPointsDeepCopy = dataPoints.map((dp) => ({ ...dp }));

    const asgmts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const c1: DataPoint = { id: "1002", x: 70, y: 70 };
    const c2: DataPoint = { id: "1007", x: 45, y: 45 };
    const c3: DataPoint = { id: "1014", x: 15, y: 15 };
    const centroids: DataPoint[] = [c1, c2, c3];
    const centroidsDeepCopy = centroids.map((c) => ({ ...c }));

    // assignments will be updated in place
    const res = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];

    // expect(centroids).toEqual(res);
    expect(assignItemsToClusters(dataPoints, centroids, asgmts)).toEqual(11);
    expect(dataPoints).toEqual(dataPointsDeepCopy);
    expect(centroids).toEqual(centroidsDeepCopy);
    expect(asgmts).toEqual(res);
    expect(assignItemsToClusters(dataPoints, centroids, asgmts)).toEqual(0);
  });
});

describe("initalizeCentroids function", () => {
  it("initalizeCentroids description", () => {
    const dataPointsDeepCopy = dataPoints.map((dp) => ({ ...dp }));

    let centroids: DataPoint[] = initalizeCentroids(3, dataPoints);
    expect(centroids.length).toEqual(3);
    for (let i = 0; i < 3; i++) {
      expect(dataPoints).toContainEqual(centroids[i]);
    }
    for (let i = 0; i < 3; i++) {
      // to verify if centroids are deep copied
      centroids[i].x = centroids[i].x * 1.01;
      expect(dataPoints).not.toContainEqual(centroids[i]);
    }
    expect(dataPoints).toEqual(dataPointsDeepCopy);
  });
});

describe("getMeanSquaredDistance function", () => {
  it("getMeanSquaredDistance description", () => {
    const c1: DataPoint = { id: "1002", x: 71.57, y: 68.84 };
    const c2: DataPoint = { id: "1007", x: 44.29, y: 46.03 };
    const c3: DataPoint = { id: "1014", x: 14.64, y: 16.04 };
    const centroids: DataPoint[] = [c1, c2, c3];
    const asgmts = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
    const res = 170.77;
    expect(getMeanSquaredDistance(dataPoints, centroids, asgmts)).toEqual(res);
  });
});

// describe("kMeansClustering function", () => {
//   it("kMeansClustering description", () => {
//     // k = 3, the optimal number of clusters
//     // let c1: DataPoint = { id: "1002", x: 71.57, y: 68.84 };
//     // let c2: DataPoint = { id: "1007", x: 44.29, y: 46.03 };
//     // let c3: DataPoint = { id: "1014", x: 14.64, y: 16.04 };
//     // const centroids: DataPoint[] = [c1, c2, c3];
//     // const asgmts = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
//     // const expectedRes: [DataPoint[], number[]] = [centroids, asgmts];
//     const actualRes = kMeansClustering(dataPoints, 3);
//     // print centroids as (id, x, y) pairs
//     for (let i = 0; i < actualRes[0].length; i++) {
//       console.error(
//         `!!! print centroids ${actualRes[0][i].id}, ${actualRes[0][i].x}, ${actualRes[0][i].y}`
//       );
//     }
//     // print assignments
//     console.error(`!!! print assignments ${actualRes[1]}`);
//   });
// });

describe("runKMeansForNTimes function", () => {
  it("runKMeansForNTimes description", () => {
    const actualRes = runKMeansForNTimes(dataPoints, 3);
    const actualCentroids = actualRes[0];
    const actualAssignments = actualRes[1];

    // test centroids
    expect(actualCentroids.length).toEqual(3);
    const set1 = new Set([
      actualCentroids[0].x,
      actualCentroids[1].x,
      actualCentroids[2].x,
    ]);
    expect(set1.size).toEqual(3);
    expect(set1.has(71.57)).toEqual(true);
    expect(set1.has(44.29)).toEqual(true);
    expect(set1.has(14.64)).toEqual(true);
    const set2 = new Set([
      actualCentroids[0].y,
      actualCentroids[1].y,
      actualCentroids[2].y,
    ]);
    expect(set2.size).toEqual(3);
    expect(set2.has(68.84)).toEqual(true);
    expect(set2.has(46.03)).toEqual(true);
    expect(set2.has(16.04)).toEqual(true);

    // test assignments
    let cluster1 = 0;
    let cluster2 = 0;
    let cluster3 = 0;
    for (let i = 0; i < actualAssignments.length; i++) {
      if (actualAssignments[i] === 0) {
        cluster1++;
      } else if (actualAssignments[i] === 1) {
        cluster2++;
      } else {
        cluster3++;
      }
    }
    // put clusters in a set, the set shall contains 4, 5, 6
    const set = new Set([cluster1, cluster2, cluster3]);
    expect(set.size).toEqual(3);
    expect(set.has(4)).toEqual(true);
    expect(set.has(5)).toEqual(true);
    expect(set.has(6)).toEqual(true);
  });
});
