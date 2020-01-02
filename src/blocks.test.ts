import { Shape } from "./primitives";
import {
  shapes,
  flipX,
  flipY,
  rotateClockWise90,
  shapeVariations,
  allShapeVariations,
  sizeOf,
  PuzzleArea
} from "./blocks";

const shape: Shape = [
  [0, 0, 0, 0, 0],
  [1, 2, 3, 4, 6]
];

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

const p = new PuzzleArea(10, 5);
p.fillWith(allShapeVariations(shapes));
console.log("puzzle", p);
