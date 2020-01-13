import { flipX, flipY, rotateClockWise90, blockVariations, clone, sizeOf } from "./block";
import { Block } from "./primitives";

describe("Block", () => {
  let block: Block;
  beforeEach(() => {
    block = [
      [0, 0, 1],
      [1, 1, 1]
    ];
  });

  it("sizeOf", () => {
    expect(sizeOf(block)).toBe(4);
  });

  describe("clone", () => {
    it("clones deeply", () => {
      const cloned = clone(block);
      expect(cloned).not.toBe(block);
      expect(cloned[0]).not.toBe(block[0]);
    });
    it("copied values exactly", () => {
      const cloned = clone(block);
      expect(cloned).toStrictEqual(block);
    });
  });

  describe("flipX", () => {
    it("flips correct values", () => {
      expect(flipX(block)).toStrictEqual([
        [1, 0, 0],
        [1, 1, 1]
      ]);
    });
    it("clones arrays deeply", () => {
      const flipped = flipX(block);
      expect(flipped).not.toBe(block);
      expect(flipped[0]).not.toBe(block[0]);
    });
  });

  describe("flipY", () => {
    it("flips correct values", () => {
      expect(flipY(block)).toStrictEqual([
        [1, 1, 1],
        [0, 0, 1]
      ]);
    });
    it("clones arrays deeply", () => {
      const flipped = flipY(block);
      expect(flipped).not.toBe(block);
      expect(flipped[0]).not.toBe(block[0]);
    });
  });

  describe("rotateClockWise90", () => {
    it("rotates correct values", () => {
      expect(rotateClockWise90(block)).toStrictEqual([
        [1, 0],
        [1, 0],
        [1, 1]
      ]);
    });
    it("clones arrays deeply", () => {
      const rotated = rotateClockWise90(block);
      expect(rotated).not.toBe(block);
      expect(rotated[0]).not.toBe(block[0]);
    });
  });

  it("blockVariations", () => {
    const block = [
      [0, 1],
      [0, 1]
    ];
    expect(blockVariations(block)).toHaveLength(4);
  });
});
