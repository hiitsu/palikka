import { Grid } from "./grid";
import { Block } from "./primitives";

describe("Grid", () => {
  const block: Block = [
    [0, 0, 1],
    [1, 1, 1]
  ];

  it("initializes to zeros", () => {
    expect(new Grid(1, 1).slots[0][0]).toBe(0);
  });

  it("canFit should return true when block is fully inside grid", () => {
    expect(new Grid(3, 3).canFit(0, 0, block)).toBe(true);
  });

  it("canFit return false when block goes slightly out", () => {
    expect(new Grid(3, 3).canFit(1, 0, block)).toBe(false);
  });

  it("canFit return false overlaps", () => {
    const grid = new Grid(3, 3);
    grid.mergeBlock(0, 0, block);
    expect(grid.canFit(1, 0, block)).toBe(false);
  });
});
