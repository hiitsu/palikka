import { PositionedBlock } from "../primitives";
import { SlotView } from "./SlotView";

export function BlockView(props: {
  blockId: number;
  block: PositionedBlock;
  color: number;
  canSelect: boolean;
  zIndex: number;
}) {
  return (
    <div
      key={`block-${props.blockId}`}
      className="block"
      draggable="false"
      style={{
        left: props.block.x,
        top: props.block.y,
        zIndex: props.zIndex
      }}
    >
      {props.block.block.map((row, y) => {
        return (
          <div
            key={`block-${props.blockId}-row-${y}`}
            className="block-row"
            draggable="false"
          >
            {row.map((value, x) => (
              <SlotView
                canSelect={props.canSelect}
                slotId={`${props.blockId}-${x}-${y}`}
                value={value}
                color={props.color}
                key={`${props.blockId}-${x}-${y}`}
              />
            ))}
          </div>
        );
      })}
      <style jsx>{`
        .block {
          cursor: move;
          box-sizing: border-box;
          padding: 0;
          background-color: transparent;
          position: absolute;
          display: inline-block;
          z-index: 10;
          user-select: none;
          pointer-events: none;
        }
        .block-row {
          box-sizing: border-box;
          height: 1cm;
          z-index: 10;
          user-select: none;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
