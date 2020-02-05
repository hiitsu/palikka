import Head from "next/head";

export default function CommonHead(props: { title: string }) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta
        name="viewport"
        content="minimal-ui, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width, user-scalable=no"
        key="viewport"
      />
      <link
        key="google-fonts"
        href="https://fonts.googleapis.com/css?family=Inconsolata:400,700&display=swap"
        rel="stylesheet"
      />
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
      <meta key="msapplication-tap-highlight" name="msapplication-tap-highlight" content="no" />
    </Head>
  );
}
