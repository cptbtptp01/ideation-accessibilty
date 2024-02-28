import { getLocation } from "../src/grouping";

// TODO: to be refactored into mockBoardNodes.ts
const mockItems = [
  {
    type: "text",
    content: "<p><strong>Example Text</strong></p>",
    id: "123456789",
    x: 100,
    y: 200,
    width: 50,
    height: 80,
    rotation: 0,
  },
  {
    type: "connector",
    id: "147258369",
    start: {
      item: "123",
    },
    end: {
      item: "456",
      snapTo: "left",
    },
    captions: [],
    parentId: null,
    origin: "center",
  },
];

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("123456789", mockItems)).toEqual([125, 240]);
  });
});

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("147258369", mockItems)).toEqual([0, 0]);
  });
});

describe("getLocation function", () => {
  it("should return the center location of the item", () => {
    expect(getLocation("111111111", mockItems)).toEqual([0, 0]);
  });
});
