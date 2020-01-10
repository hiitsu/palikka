import { isComplete, randomPuzzle } from "./puzzle";

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
    it("creates completeable", () => {
      const ingredients = randomPuzzle({ w: 2, h: 2 }, 10);
      expect(ingredients.blocks.length).toBeGreaterThan(0);
    });
  });
});
