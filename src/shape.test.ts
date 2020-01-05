import {
  Shape,
  flipX,
  flipY,
  rotateClockWise90,
  shapeVariations,
  allShapeVariations,
  sizeOf
} from "./shape";

describe("Shape", () => {
  let shape: Shape;
  beforeEach(() => {
    shape = [
      [0, 0, 1],
      [1, 1, 1]
    ];
  });

  it("sizeOf", () => {
    expect(sizeOf(shape)).toBe(4);
  });

  describe("flipX", () => {
    it("flips correct values", () => {
      expect(flipX(shape)).toStrictEqual([
        [1, 0, 0],
        [1, 1, 1]
      ]);
    });
    it("clones arrays deeply", () => {
      const flipped = flipX(shape);
      expect(flipped).not.toBe(shape);
      expect(flipped[0]).not.toBe(shape[0]);
    });
  });

  describe("flipY", () => {
    it("flips correct values", () => {
      expect(flipY(shape)).toStrictEqual([
        [1, 1, 1],
        [0, 0, 1]
      ]);
    });
    it("clones arrays deeply", () => {
      const flipped = flipY(shape);
      expect(flipped).not.toBe(shape);
      expect(flipped[0]).not.toBe(shape[0]);
    });
  });

  describe("rotateClockWise90", () => {
    it("rotates correct values", () => {
      expect(rotateClockWise90(shape)).toStrictEqual([
        [1, 0],
        [1, 0],
        [1, 1]
      ]);
    });
    it("clones arrays deeply", () => {
      const rotated = rotateClockWise90(shape);
      expect(rotated).not.toBe(shape);
      expect(rotated[0]).not.toBe(shape[0]);
    });
  });

  it("shapeVariations", () => {
    const shape = [
      [0, 1],
      [0, 1]
    ];
    expect(shapeVariations(shape)).toHaveLength(4);
  });
});
