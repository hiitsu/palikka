import React, { Fragment } from "react";
import CommonHead from "../src/ui/CommonHead";
import Head from "next/head";
import PuzzleVisualizedView from "../src/ui/PuzzleVisualizedView";
import { randomPuzzle, renderColorGrid } from "../src/puzzle";
import Button from "../src/ui/Button";
import StyledNextLink from "../src/ui/StyledNextLink";

export default (props: any) => {
  return (
    <>
      <CommonHead title="landing" />

      <header className="section-header">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h1>Palikka</h1>
              <p>Dumbass puzzle game</p>
            </div>
          </div>
        </div>
      </header>

      <section className="section-hero">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 6, h: 6 }, 7))} />
            </div>
            <div className="col-2 hidden-sm">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 6, h: 6 }, 7))} />
            </div>
            <div className="col-2 hidden-sm">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 6, h: 6 }, 7))} />
            </div>
            <div className="col-2 hidden-sm">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 6, h: 6 }, 7))} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-play-now">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <p>Are you at the office and want to look busy?</p>
              <StyledNextLink text={"Play Now"} href="/" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-instructions">
        <div className="container">
          <div className="row">
            <div className="col-2 hidden-sm">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 5, h: 8 }, 7))} />
            </div>
            <div className="col-6">
              <h2>Instructions</h2>
              <p>
                On desktop use <strong>AWSD</strong> or <strong>UP</strong>, <strong>DOWN</strong>,{" "}
                <strong>LEFT</strong>, <strong>RIGHT</strong> keys to flip blocks around their axis and{" "}
                <img src="/img/mouse.svg" style={{ marginBottom: -4 }} alt="image of mouse" /> <strong>mouse</strong> to
                move them around.
              </p>
              <p>
                On mobile you one <img src="/img/finger.svg" style={{ marginBottom: -4 }} alt="image of mouse" />{" "}
                <strong>finger</strong> to move blocks around. Press longer on block to flip it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-variations">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <h2>Simple for kids</h2>
              <p>
                Kids get easily bored, and they play way too much, so let them play. This is just another pen in the
                box.
              </p>
            </div>
            <div className="col-4">
              <h2>Wanna be genius?</h2>
              <p>
                Let's face it, this game will not make you smart, but it doesn't hurt to try unless you are on
                pedestrian crossing.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <h2>Challenge your friends</h2>
              <p>
                Assuming you have friends, you can now see if they are actually dumb as you always thought they were.
                Solve some puzzles and send them same puzzles and compare results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-illustrations">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 6, h: 3 }, 4))} />
            </div>
            <div className="col-2 hidden-sm">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 6, h: 6 }, 5))} />
            </div>
            <div className="col-2 hidden-sm">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 6, h: 9 }, 6))} />
            </div>
            <div className="col-2 hidden-sm">
              <PuzzleVisualizedView grid={renderColorGrid(randomPuzzle({ w: 6, h: 7 }, 6))} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-boring">
        <div className="container">
          <div className="row">
            <section className="col-4">
              <h2>Development Blog Post</h2>
              <p>There is a blog post about it</p>
            </section>
            <div className="col-4">
              <h2>Privacy</h2>
              <p>There are no external analytic-service.</p>
            </div>
          </div>
        </div>
      </section>

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
        .container {
          margin-left: auto;
          margin-right: auto;
        }
        * {
          font-family: "Inconsolata", monospace;
          line-height: 1.5;
        }
        h1 {
          font-size: 2.5em;
        }
        h2 {
          margin-top: 0;
          padding-top: 0;
          font-size: 1.5em;
        }
        h3 {
          font-size: 1.375em;
        }
        h4 {
          font-size: 1.125em;
        }
        h5 {
          font-size: 1em;
        }
        h6 {
          font-size: 0.875em;
        }
        p {
          font-size: 1.125em;
          font-weight: 200;
          line-height: 1.5em;
        }
        .container {
          width: 100%;
          max-width: 1023px;
        }
        .row {
          position: relative;
          width: 100%;
        }
        .row [class*="col-"] {
          float: left;
          margin: 0;
          padding: 0 1em;
          min-height: 0.125em;
          box-sizing: border-box;
          /*
          border: 1px solid #ccc;*/
        }
        .col-2,
        .col-4,
        .col-6,
        .col-8 {
          width: 100%;
        }
        .row::after {
          content: "";
          display: table;
          clear: both;
        }
        .hidden-sm {
          display: none;
        }

        [class*="section-"] {
          padding: 1.2em 0 1.8em 0;
          color: #333447;
        }

        @media only screen and (min-width: 40em) {
          .col-2 {
            width: 25%;
          }
          .col-4 {
            width: 50%;
          }
          .col-6 {
            width: 75%;
          }
          .col-8 {
            width: 100%;
          }
          .hidden-sm {
            display: block;
          }
          [class*="section-"] {
            padding: 2em 0;
          }
        }
        .section-hero .col-2 {
        }
        .section-play-now {
          background: #ededed;
        }
        .section-play-now p {
          display: inline-block;
          margin: 0 1em 1em 0;
        }
        .section-instructions {
        }
        .section-boring {
          background-color: #e1e1b0;
          color: #333;
        }
        .section-variations {
          background-color: #e1e1b0;
          color: #333;
        }
        .section-header h1 {
          line-height: 1em;
          margin-bottom: 0;
        }
        .section-header p {
          margin: 0;
          line-height: 1em;
        }
      `}</style>
    </>
  );
};
