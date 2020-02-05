import React from "react";
import { AuthProvider, AuthConsumer } from "../src/ui/AuthContext";
import ScoreList from "../src/ui/SolutionList";
import CommonHead from "../src/ui/CommonHead";

export default (props: any) => {
  return (
    <AuthProvider>
      <CommonHead title="My stats" />

      <header className="section-header">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h1>Completed Puzzles</h1>
            </div>
          </div>
        </div>
      </header>
      <section className="section-my-solutions">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <AuthConsumer>{({ signedUp }) => <ScoreList signedUp={signedUp} />}</AuthConsumer>
            </div>
          </div>
        </div>
      </section>
    </AuthProvider>
  );
};
