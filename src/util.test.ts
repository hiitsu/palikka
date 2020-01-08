import { array2D } from "./util";

describe("util", () => {
  describe("array2D", () => {
    it("initializing with value", () => {
      const array = array2D<number>(2, 2, () => 1);
      expect(array).toStrictEqual([
        [1, 1],
        [1, 1]
      ]);
    });
  });
});
