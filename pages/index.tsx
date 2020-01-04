import { DndProvider, useDrag, useDrop } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { shapes, Puzzle } from "../src/puzzle";
import { Shape, allShapeVariations, sizeOf } from "../src/shape";
import { Grid } from "../src/grid";
import { ColorGrid } from "../src/primitives";
import { colors } from "../src/colors";

export function SlotComponent(props: { key: number; value: number }) {
  const className = `slot slot-${props.value}`;
  return (
    <div
      key={props.key}
      className={className}
      style={{ background: colors[props.value] }}
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

export function DraggableShapeComponent(props: { key: number; shape: Shape }) {
  const [collectedProps, drag] = useDrag({
    item: { id: 1, type: "a" }
  });
  return (
    <div ref={drag} key={props.key} className="shape">
      {props.shape.map((row, index) => {
        return (
          <div key={index} className="shape-row">
            {row.map((value, index) => SlotComponent({ value, key: index }))}
          </div>
        );
      })}
      <style jsx>{`
        .shape {
          box-sizing: border-box;
          padding: 1em;
          background-color: #eee;
        }
        .shape-row {
          box-sizing: border-box;
          height: 1cm;
        }
      `}</style>
    </div>
  );
}

export function ShapeComponent(props: { key: number; shape: Shape }) {
  return (
    <div key={props.key} className="shape">
      {props.shape.map((row, index) => {
        return (
          <div key={index} className="shape-row">
            {row.map((value, index) => SlotComponent({ value, key: index }))}
          </div>
        );
      })}
      <style jsx>{`
        .shape {
          box-sizing: border-box;
          padding: 1em;
          background-color: #eee;
        }
        .shape-row {
          box-sizing: border-box;
          height: 1cm;
        }
      `}</style>
    </div>
  );
}

export function ShapeListComponent(props: { shapes: Shape[] }) {
  return props.shapes.map((shape, index) =>
    ShapeComponent({ shape, key: index })
  );
}

export function DroppableGridComponent(props: { grid: ColorGrid }) {
  const [collectedProps, drop] = useDrop({
    accept: "a"
  });
  return (
    <div ref={drop} className="grid">
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
    <>
      <h1>Puzzles</h1>

      <h2>Size 4x4</h2>
      <GridComponent grid={randomPuzzle(4, 4, 4).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(4, 4, 5).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(4, 4, 6).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(4, 4, 7).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(4, 4, 8).renderColorGrid()} />

      <h2>Size 5x5</h2>
      <GridComponent grid={randomPuzzle(5, 5, 4).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(5, 5, 5).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(5, 5, 6).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(5, 5, 7).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(5, 5, 8).renderColorGrid()} />

      <h2>Size 6x6</h2>
      <GridComponent grid={randomPuzzle(6, 6, 5).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(6, 6, 6).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(6, 6, 7).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(6, 6, 8).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(6, 6, 9).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(6, 6, 10).renderColorGrid()} />

      <h2>Size 8x8</h2>
      <GridComponent grid={randomPuzzle(8, 8, 5).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 6).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 7).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 8).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 9).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 10).renderColorGrid()} />

      <DndProvider backend={Backend}>
        <DroppableGridComponent grid={colorGrid} />
        <DraggableShapeComponent key={123} shape={shapes[0]} />
      </DndProvider>

      <style jsx global>
        {`
          body {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </>
  );
}

export default HomePage;
