import { FunctionComponent } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/styles.scss";

const App: FunctionComponent<AppProps> = props => {
  const { Component, pageProps } = props;
  const headTags = (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Regal Flowers</title>
    </Head>
  );

  return (
    <div className="app-wrapper">
      {headTags}
      <Component {...pageProps} />
    </div>
  );
};

export default App;
