import { randomPuzzle } from "../src/puzzle";
import { ColorGrid } from "../src/primitives";
import colors from "../src/colors";

function SlotComponent(props: { key: number | string; value: number }) {
  const className = `slot slot-${props.value}`;
  return (
    <div
      key={props.key}
      className={className}
      style={{
        background: colors[props.value]
      }}
    >
      <style jsx>{`
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

function GridComponent(props: { grid: ColorGrid }) {
  return (
    <div className="grid">
      {props.grid.map((row, index) => {
        return (
          <div key={index} className="grid-row">
            {row.map((value, index) => SlotComponent({ value: value as number, key: index }))}
          </div>
        );
      })}
      <style jsx>{`
        .grid {
          box-sizing: border-box;
          padding: 1em;
          background-color: #eee;
        }
        .grid-row {
          box-sizing: border-box;
          height: 1cm;
        }
      `}</style>
    </div>
  );
}

function RandomPuzzles() {
  return (
    <>
      <h1>Puzzles</h1>

      <h2>Size 4x4</h2>
      <GridComponent grid={randomPuzzle({ w: 4, h: 4 }, 7).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 4, h: 4 }, 8).colorGrid} />

      <h2>Size 5x5</h2>
      <GridComponent grid={randomPuzzle({ w: 5, h: 5 }, 7).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 5, h: 5 }, 8).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 5, h: 5 }, 9).colorGrid} />

      <h2>Size 6x6</h2>
      <GridComponent grid={randomPuzzle({ w: 6, h: 6 }, 8).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 6, h: 6 }, 9).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 6, h: 6 }, 10).colorGrid} />

      <h2>Size 8x8</h2>
      <GridComponent grid={randomPuzzle({ w: 8, h: 8 }, 6).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 8, h: 8 }, 7).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 8, h: 8 }, 8).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 8, h: 8 }, 9).colorGrid} />
      <GridComponent grid={randomPuzzle({ w: 8, h: 8 }, 10).colorGrid} />

      <style jsx global>
        {`
          body {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </>
  );
}

export default RandomPuzzles;
