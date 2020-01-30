import { randomPuzzle } from "../src/puzzle";
import PuzzleVisualizedView from "../src/ui/PuzzleVisualizedView";
import CommonHead from "../src/ui/CommonHead";

function RandomPuzzles() {
  return (
    <>
      <CommonHead title="examples of randomized puzzles" />
      <h1>Puzzles</h1>

      <h2>Size 4x4</h2>
      <PuzzleVisualizedView grid={randomPuzzle({ w: 4, h: 4 }, 7).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 4, h: 4 }, 8).colorGrid} />

      <h2>Size 5x5</h2>
      <PuzzleVisualizedView grid={randomPuzzle({ w: 5, h: 5 }, 7).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 5, h: 5 }, 8).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 5, h: 5 }, 9).colorGrid} />

      <h2>Size 6x6</h2>
      <PuzzleVisualizedView grid={randomPuzzle({ w: 6, h: 6 }, 8).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 6, h: 6 }, 9).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 6, h: 6 }, 10).colorGrid} />

      <h2>Size 8x8</h2>
      <PuzzleVisualizedView grid={randomPuzzle({ w: 8, h: 8 }, 6).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 8, h: 8 }, 7).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 8, h: 8 }, 8).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 8, h: 8 }, 9).colorGrid} />
      <PuzzleVisualizedView grid={randomPuzzle({ w: 8, h: 8 }, 10).colorGrid} />

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
