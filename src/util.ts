type ArrayFillFunction<T> = (x: number, y: number) => T;
export const array2D = <T>(width: number, height: number, fillFunction: ArrayFillFunction<T>): Array<Array<T>> => {
  const array: Array<Array<T>> = [];
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

export const arrayOfPoints = (width: number, height: number, includeNegatives?: boolean) => {
  const points = [];
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      points.push({ x: i, y: j });
      if (includeNegatives) {
        points.push({ x: -i, y: -j });
        points.push({ x: i, y: -j });
        points.push({ x: -i, y: j });
      }
    }
  }
  return points;
};

export const randomInt = (from: number, to: number): number => from + Math.floor(Math.random() * to - from);

export default function snapToGrid(x: number, y: number, gridSize: number = 32) {
  const snappedX = Math.round(x / gridSize) * gridSize;
  const snappedY = Math.round(y / gridSize) * gridSize;
  return [snappedX, snappedY];
}

export const debounce = <F extends (...args: any) => any>(func: F, waitFor: number) => {
  let timeout: number = 0;

  const debounced = (...args: any) => {
    clearTimeout(timeout);
    setTimeout(() => func(...args));
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export const millisToMinutesAndSeconds = (millis: number): string => {
  let seconds = Math.floor(millis / 1000);

  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  return [minutes, seconds].map(n => String(n).padStart(2, "0")).join(":");
};
