import Draggable from "react-draggable";
import { shapes, Puzzle } from "../src/puzzle";
import {
  Shape,
  allShapeVariations,
  sizeOf,
  flipX,
  flipY,
  rotateClockWise90
} from "../src/shape";
import { Grid } from "../src/grid";
import { ColorGrid } from "../src/primitives";
import { colors } from "../src/colors";
import { useState } from "react";

export function SlotComponent(props: {
  key: number | string;
  value: number;
  color: number;
}) {
  const className = `slot`;
  return (
    <div
      key={props.key}
      className={className}
      style={{
        background:
          props.value == 0 ? "transparent" : colors[props.color % colors.length]
      }}
    >
      <style jsx>{`
        .slot {
          width: 1cm;
          height: 1cm;
          display: inline-block;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export function ShapeComponent(props: {
  key?: number;
  shape: Shape;
  color: number;
}) {
  const [shape, setShape] = useState(props.shape);
  return (
    <div
      key={props.key}
      className="shape"
      onContextMenu={ev => {
        setShape(rotateClockWise90(shape));
        ev.preventDefault();
        return false;
      }}
    >
      {shape.map((row, index) => {
        return (
          <div key={index} className="shape-row">
            {row.map((value, index) =>
              SlotComponent({ value, color: props.color, key: index })
            )}
          </div>
        );
      })}
      <style jsx>{`
        .shape {
          box-sizing: border-box;
          padding: 0;
          background-color: transparent;
          position: absolute;
          display: inline-block;
        }
        .shape-row {
          box-sizing: border-box;
          height: 1cm;
        }
      `}</style>
    </div>
  );
}

export function GridComponent(props: { grid: ColorGrid }) {
  return (
    <div className="grid">
      {props.grid.map((row, index) => {
        return (
          <div key={index} className="grid-row">
            {row.map((value, index) => SlotComponent({ value, key: index }))}
          </div>
        );
      })}
      <style jsx>{`
        .grid {
          box-sizing: border-box;
          padding: 1em;
          background-color: #eee;
        }
        .grid-row {
          box-sizing: border-box;
          height: 1cm;
        }
      `}</style>
    </div>
  );
}

function randomPuzzle(w: number = 8, h: number = 5, maxShapeSize = 5) {
  const puzzle = new Puzzle(w, h);
  const shapesWithMatchingSize = shapes.filter(
    shape => sizeOf(shape) <= maxShapeSize
  );
  puzzle.fillWith(allShapeVariations(shapesWithMatchingSize));
  return puzzle;
}

const colorGrid = new Puzzle(5, 5).renderColorGrid();

function HomePage() {
  return (
    <div className="puzzle">
      {shapes.map((shape, index) => {
        return (
          <Draggable key={index}>
            <div>
              <ShapeComponent shape={shape} color={index} />
            </div>
          </Draggable>
        );
      })}
      ;
      <style jsx global>
        {`
          body {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;
