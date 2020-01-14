import { isComplete, randomPuzzle } from "./puzzle";
import { Size } from "./primitives";
import { sizeOf } from "./block";

describe("Puzzle", () => {
  describe("isComplete", () => {
    it("false when one block does not fill the whole area", () => {
      expect(
        isComplete({ w: 2, h: 2 }, [
          {
            x: 0,
            y: 0,
            block: [
              [1, 0],
              [1, 1]
            ]
          }
        ])
      ).toBe(false);
    });
    it("true when one block fills the whole area", () => {
      expect(
        isComplete({ w: 2, h: 2 }, [
          {
            x: 0,
            y: 0,
            block: [
              [1, 1],
              [1, 1]
            ]
          }
        ])
      ).toBe(true);
    });
  });

  describe("randomPuzzle", () => {
    it("creates completeable puzzle every time x100 for 6x6", () => {
      for (let i = 0; i < 100; i++) {
        const puzzleSize: Size = { w: 6, h: 6 };
        const maxBlockSize = 10;
        const ingredients = randomPuzzle(puzzleSize, maxBlockSize);
        const totalBlockSum = ingredients.blocks.reduce((memo, block) => memo + sizeOf(block), 0);
        //console.log("isComplete", isComplete(puzzleSize, ingredients.positionedBlocks));
        expect(totalBlockSum).toBe(puzzleSize.w * puzzleSize.h);
      }
    });
    it("creates completeable puzzle every time x100 for 5x5", () => {
      for (let i = 0; i < 100; i++) {
        const puzzleSize: Size = { w: 5, h: 5 };
        const maxBlockSize = 10;
        const ingredients = randomPuzzle(puzzleSize, maxBlockSize);
        const totalBlockSum = ingredients.blocks.reduce((memo, block) => memo + sizeOf(block), 0);
        //console.log("isComplete", isComplete(puzzleSize, ingredients.positionedBlocks));
        expect(totalBlockSum).toBe(puzzleSize.w * puzzleSize.h);
      }
    });
    it("creates completeable puzzle every time x100 for 8x8", () => {
      for (let i = 0; i < 100; i++) {
        const puzzleSize: Size = { w: 8, h: 8 };
        const maxBlockSize = 10;
        const ingredients = randomPuzzle(puzzleSize, maxBlockSize);
        const totalBlockSum = ingredients.blocks.reduce((memo, block) => memo + sizeOf(block), 0);
        //console.log("isComplete", isComplete(puzzleSize, ingredients.positionedBlocks));
        expect(totalBlockSum).toBe(puzzleSize.w * puzzleSize.h);
      }
    });
  });
});
