import React, { useState, useEffect } from "react";
import Api from "./Api";
import { Puzzle, PuzzleStats } from "../primitives";
import PuzzleVisualizedView from "./PuzzleVisualizedView";
import { renderColorGrid } from "../puzzle";

export default (props: { signedUp: boolean }) => {
  const [solutions, setSolutions] = useState<Puzzle[] | null>(null);
  const [statistics, setStatistics] = useState<PuzzleStats[]>([]);

  useEffect(() => {
    if (!props.signedUp) return;
    if (solutions) return;
    (async function callApis() {
      const list = await Api.solution.list();
      const statistics = await Promise.all(list.map(puzzle => Api.puzzle.stats(puzzle.solutionFor as number)));
      setStatistics(([] as PuzzleStats[]).concat(statistics, statistics, statistics, statistics, statistics));
      setSolutions(([] as Puzzle[]).concat(list, list, list, list, list));
    })();
  });
  if (!solutions || !solutions.length) {
    return <p>You haven't played anything yet</p>;
  }
  return (
    <>
      {solutions.map((solution, index) => {
        console.log(solution);
        return (
          <div style={{ width: "25%", float: "left", boxSizing: "border-box", padding: "1em" }} key={index}>
            <PuzzleVisualizedView grid={renderColorGrid(solution)} />
            <p>Your time: {solution.seconds}s</p>
            <p>Played by {statistics[index].solutionCount} people</p>
            <p>Best time: {statistics[index].bestTime}</p>
            <p>Average time: {statistics[index].averageTime}</p>
          </div>
        );
      })}
    </>
  );
};
