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
    it("creates completeable puzzle every time x100", () => {
      expect.assertions(100);
      for (let i = 0; i < 100; i++) {
        const puzzleSize: Size = { w: 2, h: 2 };
        const maxBlockSize = 10;
        const ingredients = randomPuzzle(puzzleSize, maxBlockSize);
        const totalBlockSum = ingredients.blocks.reduce((memo, block) => memo + sizeOf(block), 0);
        expect(totalBlockSum).toBe(puzzleSize.w * puzzleSize.h);
      }
    });
  });
});
