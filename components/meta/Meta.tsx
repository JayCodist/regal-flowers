import Head from "next/head";

interface MetaProps {
  canonicalUrl?: string;
  title: string;
  description: string;
  image: string;
  children?: React.ReactNode;
  imageAlt: string;
}

const Meta = ({
  canonicalUrl,
  title = "Regal Flowers",
  description,
  image,
  children,
  imageAlt
}: MetaProps) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Regal Flowers</title>

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt}></meta>
      <meta property="og:url" content="https://regalflowers.com.ng" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Regal Flowers"></meta>

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image:alt" content={imageAlt}></meta>

      {children}
    </Head>
  );
};

export default Meta;
