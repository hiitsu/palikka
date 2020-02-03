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
      <meta key="msapplication-tap-highlight" name="msapplication-tap-highlight" content="no" />
    </Head>
  );
}
