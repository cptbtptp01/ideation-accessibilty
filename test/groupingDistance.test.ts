import { getLocation } from "../src/kMeansClustering";
import { mockStickyNote3, mockConnector1 } from "./mockBoardNodes";

const mockItems1 = [mockStickyNote3, mockConnector1];

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
