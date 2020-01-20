import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { AuthProvider, AuthConsumer } from "./AuthContext";
import Api from "./Api";
import { Score } from "src/primitives";

export default (props: { signedUp: boolean }) => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    if (!props.signedUp) Api.score.list().then((res: any) => setScores(res.data.scores));
  });

  console.log("scores", scores);
  return (
    <div>
      {(scores || []).map(score => {
        return <p>{score}</p>;
      })}
    </div>
  );
};
