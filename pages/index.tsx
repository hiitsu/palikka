import {
  randomInt,
  randomGrid,
  Shape,
  shapes,
  flipX,
  flipY,
  rotateClockWise90,
  shapeVariations,
  sizeOf,
  arrayWith,
  allShapeVariations
} from "../src/blocks";

export function SlotComponent(props: { value: number }) {
  const className = `slot slot-${props.value}`;
  return (
    <div className={className}>
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

export function ShapeComponent(props: { shape: Shape }) {
  return (
    <div className="shape">
      {props.shape.map(row => {
        return (
          <div className="shape-row">
            {row.map(value => SlotComponent({ value }))}
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
  return props.shapes.map(shape => ShapeComponent({ shape }));
}

function HomePage() {
  return (
    <div>
      <ShapeListComponent shapes={allShapeVariations(shapes)} />
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
