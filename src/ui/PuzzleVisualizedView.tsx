import { ColorGrid } from "../primitives";
import colors from "../colors";
import Sizer, { SizerState } from "./Sizer";

function PuzzleVisualizedView(props: { grid: ColorGrid; height?: number }) {
  const w = props.grid[0].length;
  const h = props.grid.length;
  return (
    <Sizer heightMultiplier={h / w}>
      {(dimensions: SizerState) => {
        let size = dimensions.width / w;
        if (dimensions.height) {
          size = dimensions.height / h;
        }
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
    </Sizer>
  );
}

export default PuzzleVisualizedView;
