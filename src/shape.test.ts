import {
  Shape,
  flipX,
  flipY,
  rotateClockWise90,
  shapeVariations,
  allShapeVariations,
  sizeOf
} from "./shape";

const shape: Shape = [
  [0, 0, 0, 0, 0],
  [1, 2, 3, 4, 6]
];

describe("Shape", () => {
  const shape: Shape = [
    [0, 0, 1],
    [1, 1, 1]
  ];

  it("sizeOf", () => {
    expect(sizeOf(shape)).toBe(4);
  });

  it("flipX", () => {
    expect(flipX(shape)).toStrictEqual([
      [1, 0, 0],
      [1, 1, 1]
    ]);
  });

  it("flipY", () => {
    expect(flipY(shape)).toStrictEqual([
      [1, 1, 1],
      [0, 0, 1]
    ]);
  });

  it("rotateClockWise90", () => {
    expect(rotateClockWise90(shape)).toStrictEqual([
      [1, 0],
      [1, 0],
      [1, 1]
    ]);
  });

  it("shapeVariations", () => {
    const shape = [
      [0, 1],
      [0, 1]
    ];
    expect(shapeVariations(shape)).toHaveLength(4);
  });
});
