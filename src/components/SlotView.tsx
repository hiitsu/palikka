import { colors } from "../colors";

export function SlotView(props: {
  value: number;
  color: number;
  border?: boolean;
  slotId: string;
  canSelect: boolean;
}) {
  const className = `slot slot-${props.value}`;
  return (
    <div
      data-slot-id={props.slotId}
      className={className}
      draggable="false"
      style={{
        background: props.value == 0 ? "transparent" : colors[props.color % colors.length],
        border: props.border ? "1px solid #999" : "0px",
        pointerEvents: !props.canSelect ? "none" : undefined
      }}
    >
      <style jsx>{`
        .slot {
          width: 1cm;
          height: 1cm;
          display: inline-block;
          box-sizing: border-box;
          z-index: 10;
          user-select: none;
          pointer-events: all;
        }
        .slot-0 {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
