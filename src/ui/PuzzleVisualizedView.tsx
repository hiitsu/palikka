import { ColorGrid } from "../primitives";
import colors from "../colors";

function PuzzleVisualizedView(props: { grid: ColorGrid }) {
  return (
    <div className="grid">
      {props.grid.map((row, index) => {
        return (
          <div key={index} className="grid-row">
            {row.map((value, index) => {
              const className = `slot slot-${value}`;
              return (
                <div
                  key={index}
                  className={className}
                  style={{
                    background: colors[value as number]
                  }}
                ></div>
              );
            })}
          </div>
        );
      })}
      <style jsx>{`
        .grid {
          text-align: center;
          box-sizing: border-box;
          padding: 1em;
          background-color: #eee;
        }
        .grid-row {
          box-sizing: border-box;
          height: 1cm;
        }
        .slot {
          width: 1cm;
          height: 1cm;
          display: inline-block;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export default PuzzleVisualizedView;
