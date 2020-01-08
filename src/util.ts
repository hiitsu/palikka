type ArrayFillFunction<T> = (x: number, y: number) => T;
export const array2D = <T>(
  width: number,
  height: number,
  fillFunction: ArrayFillFunction<T>
): Array<Array<T>> => {
  const array = [];
  for (var i = 0; i < height; i++) {
    array[i] = [];
    for (var j = 0; j < width; j++) {
      array[i][j] = fillFunction(j, i);
    }
  }
  return array;
};

export const arrayShuffle = (list: Array<any>) => {
  return list.slice().sort(() => Math.random() - 0.5);
};

export const arrayOfPoints = (width: number, height: number) => {
  const points = [];
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      points.push({ x: i, y: j });
    }
  }
  return points;
};

export const randomInt = (from: number, to: number): number =>
  from + Math.floor(Math.random() * to - from);

export default function snapToGrid(
  x: number,
  y: number,
  gridSize: number = 32
) {
  const snappedX = Math.round(x / gridSize) * gridSize;
  const snappedY = Math.round(y / gridSize) * gridSize;
  return [snappedX, snappedY];
}
