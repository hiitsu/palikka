import { Slot } from "./primitives";
import { arrayWith } from "./util";

export type Shape = Array<Array<Slot>>;

export const sizeOf = (shape: Shape): number => {
  return shape.reduce((memo, row) => {
    return memo + row.filter(column => column > 0).length;
  }, 0);
};

export const flipX = (shape: Shape): Shape => {
  return shape.map(row => row.slice().reverse());
};

export const flipY = (shape: Shape): Shape => {
  const w = shape[0].length;
  const columns: Shape = arrayWith(w, () => [] as number[]);
  shape.forEach(row => {
    row.forEach((value: number, i: number) => {
      columns[i].push(value);
    });
  });
  columns.forEach(column => {
    column.reverse();
  });
  return shape.map((row, i) => {
    return row.map((_, j: number) => {
      return columns[j][i];
    });
  });
};

export const rotateClockWise90 = (shape: Shape): Shape => {
  const w = shape[0].length;
  const columns: Shape = new Array(w).fill(1).map(_ => []);
  shape.forEach(row => {
    row.forEach((value: number, i: number) => {
      columns[i].push(value);
    });
  });
  columns.forEach(column => {
    column.reverse();
  });
  return columns;
};

export const shapeVariations = (shape: Shape): Shape[] => {
  const flips: Shape[] = [
    shape,
    flipX(shape),
    flipY(shape),
    flipX(flipY(shape))
  ];
  const stringifiedShapes = flips
    .reduce((memo, flip) => {
      memo.push(flip);
      memo.push(rotateClockWise90(flip));
      memo.push(rotateClockWise90(rotateClockWise90(flip)));
      memo.push(rotateClockWise90(rotateClockWise90(rotateClockWise90(flip))));
      return memo;
    }, [] as Shape[])
    .map(shape => JSON.stringify(shape));

  return [...new Set(stringifiedShapes)].map(s => JSON.parse(s));
};

export const allShapeVariations = (shapes: Shape[]): Shape[] => {
  const stringifiedShapes: string[] = shapes
    .reduce((list, shape) => {
      return list.concat(shapeVariations(shape));
    }, [] as Shape[])
    .map(shape => JSON.stringify(shape));

  return [...new Set(stringifiedShapes)].map(s => JSON.parse(s));
};
