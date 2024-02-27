import { add, getLocation } from "../src/grouping";

const mockItems1 = [
  {
    type: "text",
    content: "<p><strong>Example Text</strong></p>",
    style: {
      fillColor: "transparent",
      fillOpacity: 1,
      fontFamily: "open_sans",
      fontSize: 258.9578859236845,
      textAlign: "left",
      color: "#1a1a1a",
    },
    id: "123456789",
    parentId: "3458764579687192677",
    origin: "center",
    relativeTo: "parent_top_left",
    createdAt: "2024-02-20T18:53:22.829Z",
    createdBy: "3458764575728178245",
    modifiedAt: "2024-02-26T01:23:23.624Z",
    modifiedBy: "3458764561136524777",
    connectorIds: ["3458764580240407851"], // Assuming this text object is connected by the connector below
    x: 100,
    y: 200,
    width: 50,
    height: 50,
    rotation: 0,
  },
  {
    type: "connector",
    id: "147258369",
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
      item: "123456789", // Assuming the start is connected to the text object above
      position: {
        x: 1,
        y: 0.5,
      },
      snapTo: "right",
    },
    end: {
      item: "anotherItemId", // Specify the end item ID here
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
  },
];

describe("Math functions", () => {
  it("should add two numbers correctly", () => {
    expect(add(1, 2)).toEqual(3);
  });
});

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("123456789", mockItems1)).toEqual([125, 225]);
  });
});

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("147258369", mockItems1)).toEqual([0, 0]);
  });
});

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("111111111", mockItems1)).toEqual([0, 0]);
  });
});
