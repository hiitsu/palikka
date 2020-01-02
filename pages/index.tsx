import { shapes, Puzzle } from "../src/puzzle";
import { Shape, allShapeVariations } from "../src/shape";
import { Grid } from "../src/grid";
import { ColorGrid } from "../src/primitives";

export function SlotComponent(props: { key: number; value: number }) {
  const className = `slot slot-${props.value}`;
  return (
    <div key={props.key} className={className}>
      <style jsx>{`
        .slot {
          width: 1cm;
          height: 1cm;
          border: 1px solid #777;
          display: inline-block;
          box-sizing: border-box;
          margin: -1px 0 0 -1px;
        }
        .slot-0 {
          background: #ddd;
        }
        .slot-1 {
          background: #999;
        }
        .slot-2 {
          background: #e88;
        }
        .slot-3 {
          background: #88e;
        }
        .slot-4 {
          background: #4f4;
        }
        .slot-5 {
          background: #8aa;
        }
        .slot-6 {
          background: #8af;
        }
        .slot-7 {
          background: #ffa;
        }
        .slot-8 {
          background: #0f0;
        }
        .slot-9 {
          background: #ff0;
        }
        .slot-10 {
          background: #0ff;
        }
        .slot-11 {
          background: #33f;
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

function HomePage() {
  const puzzle = new Puzzle(10, 5);
  puzzle.fillWith(allShapeVariations(shapes));
  const colorGrid = puzzle.renderColorGrid();
  console.log(colorGrid);
  return (
    <>
      <GridComponent grid={colorGrid} />
      <ShapeListComponent shapes={allShapeVariations(shapes)} />
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
