import { PositionedBlock, Slot, Size } from "../primitives";
import { array2D } from "../util";

export function SquareView(props: { highlight?: boolean; squareId: string }) {
  return (
    <div
      data-square-id={props.squareId}
      className="square"
      draggable="false"
      style={{ background: props.highlight ? "rgba(0, 0, 0, 0.3)" : "transparent" }}
    >
      <style jsx>{`
        .square {
          width: 1cm;
          height: 1cm;
          display: inline-block;
          box-sizing: border-box;
          z-index: 1;
          border: 1px solid rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

export function GridView(props: { size: Size; highlight?: PositionedBlock }) {
  const grid = array2D(props.size.w, props.size.h, () => 0);
  return (
    <div className="grid" draggable={false}>
      {grid.map((row, y) => {
        return (
          <div key={y} className="grid-row" draggable={false}>
            {row.map((_value, x) => {
              let shouldHighlight = false;
              if (props.highlight) {
                const matchX = x >= props.highlight.x && x < props.highlight.x + props.highlight.block[0].length;
                const matchY = y >= props.highlight.y && y < props.highlight.y + props.highlight.block.length;
                shouldHighlight =
                  matchX &&
                  matchY &&
                  props.highlight.block[y - props.highlight.y][x - props.highlight.x] === Slot.Taken;
              }
              return <SquareView key={`${x}-${y}`} squareId={`${x}-${y}`} highlight={shouldHighlight} />;
            })}
          </div>
        );
      })}
      <style jsx>{`
        .grid {
          position: absolute;
          box-sizing: border-box;
          padding: 0;
          background-color: #f0f0f0;
          z-index: 1;
          top: calc(50% - 120px);
          left: calc(50% - 120px);
          border: 1px solid rgba(0, 0, 0, 0.5);
        }
        .grid-row {
          box-sizing: border-box;
          height: 1cm;
        }
      `}</style>
    </div>
  );
}
