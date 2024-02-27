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
    connectorIds: [],
    x: 100,
    y: 200,
    width: 50,
    height: 50,
    rotation: 0,
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
