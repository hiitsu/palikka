import { canFit, colorGrid, allocationGrid } from "./grid";
import { Block } from "./primitives";

describe("Grid", () => {
  const block: Block = [
    [0, 0, 1],
    [1, 1, 1]
  ];

  describe("allocationGrid", () => {
    it("render one block correctly when its fully in", () => {
      expect(allocationGrid({ w: 3, h: 2 }, [{ x: 0, y: 0, block }])).toStrictEqual([
        [0, 0, 1],
        [1, 1, 1]
      ]);
    });

    it("render one block correctly when out from right and bottom", () => {
      expect(allocationGrid({ w: 3, h: 3 }, [{ x: 2, y: 2, block: [[1]] }])).toStrictEqual([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1]
      ]);
    });
  });

  describe("canFit", () => {
    it("true when block exactly fits", () => {
      expect(canFit({ w: 3, h: 2 }, [], { x: 0, y: 0, block })).toBe(true);
    });

    it("false when block goes out from right", () => {
      expect(canFit({ w: 3, h: 2 }, [], { x: 1, y: 0, block })).toBe(false);
    });

    it("false when block goes out from bottom", () => {
      expect(canFit({ w: 3, h: 2 }, [], { x: 0, y: 1, block })).toBe(false);
    });

    it("false when block goes out from right and bottom", () => {
      expect(canFit({ w: 3, h: 3 }, [], { x: 2, y: 2, block })).toBe(false);
    });
  });

  describe("colorGrid", () => {
    it("respects given colors", () => {
      expect(colorGrid({ w: 2, h: 1 }, [{ x: 0, y: 0, block: [[1, 1]] }], [123])).toStrictEqual([[123, 123]]);
    });
    it("leaves empty spots 'transparent'", () => {
      expect(
        colorGrid(
          { w: 2, h: 2 },
          [
            {
              x: 0,
              y: 0,
              block: [
                [1, 0],
                [1, 1]
              ]
            }
          ],
          ["#cdcdcd"]
        )
      ).toStrictEqual([
        ["#cdcdcd", 0],
        ["#cdcdcd", "#cdcdcd"]
      ]);
    });
  });
});
