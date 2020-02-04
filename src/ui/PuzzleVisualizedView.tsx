import { ColorGrid } from "../primitives";
import colors from "../colors";
import ParentWith from "./ParentWidth";

function PuzzleVisualizedView(props: { grid: ColorGrid }) {
  return (
    <ParentWith>
      {(info: any) => {
        const w = props.grid[0].length;
        const size = (info.width as number) / w;
        return (
          <div className="grid">
            {props.grid.map((row, index) => {
              return (
                <div key={index} style={{ height: size }} className="grid-row">
                  {row.map((value, index) => {
                    const className = `slot slot-${value}`;
                    return (
                      <div
                        key={index}
                        className={className}
                        style={{
                          height: size,
                          width: size,
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
                text-align: left;
                box-sizing: border-box;
                padding: 0;
              }
              .grid-row {
                box-sizing: border-box;
                white-space: nowrap;
              }
              .slot {
                display: inline-block;
                box-sizing: border-box;
              }
            `}</style>
          </div>
        );
      }}
    </ParentWith>
  );
}

export default PuzzleVisualizedView;
