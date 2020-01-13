import { PositionedBlock, Slot } from "../primitives";
import { SquareView } from "./SquareView";
import { array2D } from "../util";

export function GridView(props: { width: number; height: number; highlight?: PositionedBlock }) {
  const grid = array2D(props.width, props.height, () => 0);
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
          background-color: #eee;
          z-index: 1;
          user-select: none;
          top: 25%;
          left: 25%;
          border: 1px solid black;
        }
        .grid-row {
          box-sizing: border-box;
          height: 1cm;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
