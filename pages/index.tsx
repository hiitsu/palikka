import { shapes, allShapeVariations, PuzzleArea } from "../src/blocks";
import { Shape } from "../src/primitives";

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

function HomePage() {
  const puzzle = new PuzzleArea(10, 5);
  puzzle.fillWith(allShapeVariations(shapes));
  console.log(puzzle);
  return (
    <>
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
