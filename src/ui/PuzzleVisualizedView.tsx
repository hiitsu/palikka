import { ColorGrid } from "../primitives";
import colors from "../colors";
import ContainerDimensions from "react-container-dimensions";

function PuzzleVisualizedView(props: { grid: ColorGrid }) {
  const w = props.grid[0].length;
  return (
    <ContainerDimensions>
      {({ width }) => {
        const size = width / w;
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
          </div>
        );
      }}
      <style jsx>{`
        .grid {
          text-align: left;
          box-sizing: border-box;
          padding: 0;
        }
        .grid-row {
          box-sizing: border-box;
        }
        .slot {
          display: inline-block;
          box-sizing: border-box;
        }
      `}</style>
    </ContainerDimensions>
  );
}

export default PuzzleVisualizedView;
