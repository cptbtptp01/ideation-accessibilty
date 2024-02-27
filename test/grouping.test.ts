import { add } from "../src/grouping";

describe("Math functions", () => {
  it("should add two numbers correctly", () => {
    expect(add(1, 2)).toEqual(3);
  });
});
