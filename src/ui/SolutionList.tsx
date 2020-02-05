import React, { useState, useEffect } from "react";
import Api from "./Api";
import { Puzzle } from "src/primitives";

export default (props: { signedUp: boolean }) => {
  const [solutions, setSolutions] = useState<Puzzle[]>([]);

  useEffect(() => {
    if (!props.signedUp) return;
    (async function callApi() {
      const list = await Api.solution.list();
      setSolutions(list);
    })();
  });

  return (
    <div>
      {(solutions || []).map((solution, index) => {
        return <p key={index}>{JSON.stringify(solution)}</p>;
      })}
    </div>
  );
};
