import {
  DataPoint,
  convertToDataPoints,
  getLocation,
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
