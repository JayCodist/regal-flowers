import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/icons/favicon.png" />
          <meta
            name="description"
            content="Fresh flowers vendors. Delivery throughout Nigeria"
          />
          <meta
            name="keywords"
            content="regal flowers, regal, flowers, online flowers, fresh flowers, flowers delivery"
          />
          <meta name="author" content="jaycodist@gmail.com" />
          <meta name="og:title" content="Afriland Properties" />
          <meta
            name="og:description"
            content="Get fresh flowers, delivered today"
          />
          <meta name="og:url" content="https://regalflowers.com.ng" />
          <meta property="og:image" content="/icons.logo.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
