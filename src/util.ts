export const arrayWith = (size: number, valueOrPredicate: any): Array<any> => {
  if (typeof valueOrPredicate === "number")
    return new Array(size).fill(valueOrPredicate);
  const arr = [];
  for (let i = 0; i < size; i++) arr.push(valueOrPredicate(i));
  return arr;
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
