import { SlotView } from "./SlotView";
import { BlockTracker } from "./PuzzleView";

export function BlockView(props: { tracker: BlockTracker; color: number; canSelect: boolean }) {
  return (
    <div
      key={`block-${props.tracker.blockId}`}
      className="block"
      draggable="false"
      style={{
        left: props.tracker.screenX,
        top: props.tracker.screenY,
        zIndex: props.tracker.zIndex
      }}
    >
      {props.tracker.block.map((row, y) => {
        return (
          <div key={`block-${props.tracker.blockId}-row-${y}`} className="block-row" draggable="false">
            {row.map((value, x) => (
              <SlotView
                canSelect={props.canSelect}
                slotId={`${props.tracker.blockId}-${x}-${y}`}
                value={value}
                color={props.color}
                key={`${props.tracker.blockId}-${x}-${y}`}
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
          pointer-events: none;
        }
        .block-row {
          box-sizing: border-box;
          height: 1cm;
          pointer-events: none;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
