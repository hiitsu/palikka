import {
  randomInt,
  randomGrid,
  Shape,
  flipX,
  flipY,
  rotateClockWise90,
  shapeVariations,
  sizeOf,
  arrayWith
} from "./blocks";

const shape: Shape = [
  [0, 0, 0, 0, 0],
  [1, 2, 3, 4, 6]
];

console.log("arrayWith number", arrayWith(2, 2));
console.log("randomInt", randomInt(2, 2));
console.log("randomGrid", randomGrid(5, 10));
console.log(
  "arrayWith callback",
  arrayWith(2, () => "yo")
);
console.log("shape", shape);
console.log("size", sizeOf(shape));
console.log("rotateClockWise90", rotateClockWise90(shape));
console.log(
  "2x rotateClockWise90",
  rotateClockWise90(rotateClockWise90(shape))
);
console.log("flipX", flipX(shape));
console.log("flipY", flipY(shape));
console.log("shapeVariations", shapeVariations(shape));
