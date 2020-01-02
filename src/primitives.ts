import { Shape } from "./shape";

export type ColorGrid = Array<Array<number>>;

export enum Slot {
  Empty = 0,
  Taken = 1
}

export type XY = { x: number; y: number };

export type Block = {
  x: number;
  y: number;
  shape: Shape;
};
