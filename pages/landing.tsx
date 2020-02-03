import React, { Fragment } from "react";
import CommonHead from "../src/ui/CommonHead";
import Head from "next/head";
import PuzzleVisualizedView from "../src/ui/PuzzleVisualizedView";
import { randomPuzzle } from "../src/puzzle";
import Button from "../src/ui/Button";
import StyledNextLink from "../src/ui/StyledNextLink";

export default (props: any) => {
  return (
    <>
      <CommonHead title="landing" />

      <div className="container">
        <header className="row section-header">
          <div className="col-12">
            <h1>Palikka game</h1>
            <p>Puzzles for all spirits</p>
          </div>
        </header>
        <div className="row">
          <section className="col-6 section-play-now">
            <StyledNextLink text={"Play Now"} href="/" />
          </section>
          <section className="col-6">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 5, h: 5 }, 7).colorGrid} />
          </section>
        </div>

        <section className="row section-instructions">
          <div className="col-4 hidden-sm">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 4, h: 7 }, 7).colorGrid} />
          </div>
          <div className="col-8">
            <h2>Instructions</h2>
            <p>
              On desktop use <strong>AWSD</strong> or <strong>UP</strong>, <strong>DOWN</strong>, <strong>LEFT</strong>,{" "}
              <strong>RIGHT</strong> keys to flip blocks around their axis and{" "}
              <img src="/img/mouse.svg" style={{ marginBottom: -4 }} alt="image of mouse" /> <strong>mouse</strong> to
              move them around.
            </p>
            <p>
              On mobile you one <img src="/img/finger.svg" style={{ marginBottom: -4 }} alt="image of mouse" />{" "}
              <strong>finger</strong> to move blocks around. Press longer on block to flip it.
            </p>
          </div>
        </section>

        <section className="row section-variations">
          <div className="col-4">
            <h2>Simple for kids</h2>
            <p>Kids can play 5x5 or even 4x4.</p>
          </div>
          <div className="col-4">
            <h2>Complex for geniuses</h2>
            <p>Tweak to you tasting play 5x5, 6x6, or even 7x7</p>
          </div>
          <div className="col-4">
            <h2>Challange your friends</h2>
            <p>See if your friends are actually dumb as you always thought they are.</p>
          </div>
        </section>

        <section className="row section-illustrations">
          <div className="col-3">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 3, h: 3 }, 4).colorGrid} />
          </div>
          <div className="col-3">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 3, h: 4 }, 5).colorGrid} />
          </div>
          <div className="col-3">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 3, h: 5 }, 6).colorGrid} />
          </div>
          <div className="col-3">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 3, h: 6 }, 7).colorGrid} />
          </div>
        </section>

        <div className="row">
          <section className="col-6 section-blog">
            <h2>Development Blog Post</h2>
            <p>There is a blog post about it</p>
          </section>
          <div className="col-6">
            <h2>Privacy</h2>
            <p>There are no external analytic-service.</p>
          </div>
        </div>

        <section className="row section-illustrations">
          <div className="col-4">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 5, h: 3 }, 4).colorGrid} />
          </div>
          <div className="col-4">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 5, h: 6 }, 5).colorGrid} />
          </div>
          <div className="col-4">
            <PuzzleVisualizedView grid={randomPuzzle({ w: 5, h: 9 }, 6).colorGrid} />
          </div>
        </section>
      </div>

      <style global jsx>{`
        body,
        html {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          left: 0;
          top: 0;
          font-size: 100%;
        }
        .center,
        .container {
          margin-left: auto;
          margin-right: auto;
        }
        * {
          font-family: "Inconsolata", monospace;
          color: #333447;
          line-height: 1.5;
        }
        h1 {
          font-size: 2.5rem;
        }
        h2 {
          font-size: 1.5rem;
        }
        h3 {
          font-size: 1.375rem;
        }
        h4 {
          font-size: 1.125rem;
        }
        h5 {
          font-size: 1rem;
        }
        h6 {
          font-size: 0.875rem;
        }
        p {
          font-size: 1.125rem;
          font-weight: 200;
          line-height: 1.5rem;
        }
        .font-light {
          font-weight: 300;
        }
        .font-regular {
          font-weight: 400;
        }
        .font-heavy {
          font-weight: 700;
        }
        .left {
          text-align: left;
        }
        .right {
          text-align: right;
        }
        .center {
          text-align: center;
        }
        .justify {
          text-align: justify;
        }
        .container {
          width: 90%;
        }
        .row {
          position: relative;
          width: 100%;
        }
        .row [class*="col-"] {
          float: left;
          margin: 0.5rem 2%;
          min-height: 0.125rem;
        }
        .col-1,
        .col-10,
        .col-11,
        .col-12,
        .col-2,
        .col-3,
        .col-4,
        .col-5,
        .col-6,
        .col-7,
        .col-8,
        .col-9 {
          width: 96%;
        }
        .col-1-sm {
          width: 4.33%;
        }
        .col-2-sm {
          width: 12.66%;
        }
        .col-3-sm {
          width: 21%;
        }
        .col-4-sm {
          width: 29.33%;
        }
        .col-5-sm {
          width: 37.66%;
        }
        .col-6-sm {
          width: 46%;
        }
        .col-7-sm {
          width: 54.33%;
        }
        .col-8-sm {
          width: 62.66%;
        }
        .col-9-sm {
          width: 71%;
        }
        .col-10-sm {
          width: 79.33%;
        }
        .col-11-sm {
          width: 87.66%;
        }
        .col-12-sm {
          width: 96%;
        }
        .row::after {
          content: "";
          display: table;
          clear: both;
        }
        .hidden-sm {
          display: none;
        }
        @media only screen and (min-width: 33.75em) {
          .container {
            width: 80%;
          }
        }
        @media only screen and (min-width: 45em) {
          .col-1 {
            width: 4.33%;
          }
          .col-2 {
            width: 12.66%;
          }
          .col-3 {
            width: 21%;
          }
          .col-4 {
            width: 29.33%;
          }
          .col-5 {
            width: 37.66%;
          }
          .col-6 {
            width: 46%;
          }
          .col-7 {
            width: 54.33%;
          }
          .col-8 {
            width: 62.66%;
          }
          .col-9 {
            width: 71%;
          }
          .col-10 {
            width: 79.33%;
          }
          .col-11 {
            width: 87.66%;
          }
          .col-12 {
            width: 96%;
          }
          .hidden-sm {
            display: block;
          }
        }
        @media only screen and (min-width: 60em) {
          .container {
            width: 75%;
            max-width: 60rem;
          }
        }
        .container {
          padding-top: 4em;
          max-width: 50rem;
          padding-bottom: 10em;
        }
        .section-play-now {
          padding-top: 2rem;
          padding-bottom: 2rem;
          text-align: center;
        }
        .section-instructions {
          padding-top: 2em;
        }
        .section-illustrations {
          padding-top: 2em;
        }
        .section-blog {
        }
        .section-variations {
        }
        .section-header h1 {
          display: inline-block;
          line-height: 1rem;
        }
        .section-header p {
          margin-left: 2em;
          line-height: 1rem;
          display: inline-block;
        }
      `}</style>
    </>
  );
};
