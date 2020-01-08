import { PositionedBlock, Slot } from "../primitives";
import { SquareView } from "./SquareView";

export function GridView(props: {
  grid: Array<Array<any>>;
  highlight?: PositionedBlock;
}) {
  return (
    <div className="grid" draggable={false}>
      {props.grid.map((row, y) => {
        return (
          <div key={y} className="grid-row" draggable={false}>
            {row.map((value, x) => {
              const matchX =
                x >= props.highlight.x &&
                x < props.highlight.x + props.highlight.block[0].length;
              const matchY =
                y >= props.highlight.y &&
                y < props.highlight.y + props.highlight.block.length;
              const shouldHighlight =
                matchX &&
                matchY &&
                props.highlight.block[y - props.highlight.y][
                  x - props.highlight.x
                ] === Slot.Taken;
              return (
                <SquareView
                  key={x}
                  squareId={`${x}-${y}`}
                  highlight={shouldHighlight}
                />
              );
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
