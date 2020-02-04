import React from "react";
import { AuthProvider, AuthConsumer } from "../src/ui/AuthContext";
import ScoreList from "../src/ui/SolutionList";
import CommonHead from "../src/ui/CommonHead";

export default (props: any) => {
  return (
    <AuthProvider>
      <CommonHead title="me" />
      <h1>Completed Puzzles</h1>
      <AuthConsumer>{({ signedUp }) => <ScoreList signedUp={signedUp} />}</AuthConsumer>
    </AuthProvider>
  );
};
