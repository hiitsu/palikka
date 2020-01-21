export function SquareView(props: { highlight?: boolean; squareId: string }) {
  return (
    <div
      data-square-id={props.squareId}
      className="square"
      draggable="false"
      style={{ background: props.highlight ? "red" : "transparent" }}
    >
      <style jsx>{`
        .square {
          width: 1cm;
          height: 1cm;
          display: inline-block;
          box-sizing: border-box;
          z-index: 1;
          border: 1px solid black;
        }
      `}</style>
    </div>
  );
}
