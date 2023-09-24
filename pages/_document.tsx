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
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WL8BZ9Z');`
            }}
          />
        </Head>
        <body>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WL8BZ9Z"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
