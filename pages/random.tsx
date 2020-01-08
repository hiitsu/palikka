import { randomPuzzle } from "../src/puzzle";
import { ColorGrid, Block } from "../src/primitives";
import { colors } from "../src/components/colors";

function SlotComponent(props: { key: number | string; value: number }) {
  const className = `slot slot-${props.value}`;
  return (
    <div
      key={props.key}
      className={className}
      style={{
        background: props.value > 0 ? colors[props.value] : "transparent"
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

function BlockComponent(props: { key: number; block: Block }) {
  return (
    <div key={props.key} className="block">
      {props.block.map((row, index) => {
        return (
          <div key={index} className="block-row">
            {row.map((value, index) => SlotComponent({ value, key: index }))}
          </div>
        );
      })}
      <style jsx>{`
        .block {
          box-sizing: border-box;
          padding: 1em;
          background-color: #eee;
        }
        .block-row {
          box-sizing: border-box;
          height: 1cm;
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
            {row.map((value, index) => SlotComponent({ value, key: index }))}
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
      <GridComponent grid={randomPuzzle(4, 4, 7).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(4, 4, 8).renderColorGrid()} />

      <h2>Size 5x5</h2>
      <GridComponent grid={randomPuzzle(5, 5, 7).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(5, 5, 8).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(5, 5, 9).renderColorGrid()} />

      <h2>Size 6x6</h2>
      <GridComponent grid={randomPuzzle(6, 6, 8).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(6, 6, 9).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(6, 6, 10).renderColorGrid()} />

      <h2>Size 8x8</h2>
      <GridComponent grid={randomPuzzle(8, 8, 6).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 7).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 8).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 9).renderColorGrid()} />
      <GridComponent grid={randomPuzzle(8, 8, 10).renderColorGrid()} />

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
