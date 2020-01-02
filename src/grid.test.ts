import { Grid } from "./grid";
import { Shape } from "./shape";

describe("Grid", () => {
  const shape: Shape = [
    [0, 0, 1],
    [1, 1, 1]
  ];

  it("initializes to zeros", () => {
    expect(new Grid(1, 1).slots[0][0]).toBe(0);
  });

  it("canFit return true shape is fully and all empty", () => {
    expect(new Grid(3, 3).canFit(0, 0, shape)).toBe(true);
  });

  it("canFit return false when shape goes slightly out", () => {
    expect(new Grid(3, 3).canFit(1, 0, shape)).toBe(false);
  });

  it("canFit return false overlaps", () => {
    const grid = new Grid(3, 3);
    grid.mergeShape(0, 0, shape);
    expect(grid.canFit(1, 0, shape)).toBe(false);
  });
});
