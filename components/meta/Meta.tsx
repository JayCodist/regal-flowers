import Head from "next/head";
import { regalWebsiteUrl } from "../../utils/constants";

interface MetaProps {
  canonicalUrl?: string;
  title?: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  imageAlt?: string;
  url?: string;
}

const Meta = ({
  canonicalUrl,
  title = "Regal Flowers",
  description,
  image,
  children,
  imageAlt,
  url
}: MetaProps) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      <title>Regal Flowers</title>

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta Tags */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt}></meta>}
      <meta property="og:url" content={`${url ? url : regalWebsiteUrl}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Regal Flowers"></meta>

      {/* Twitter Card Meta Tags */}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {children}
    </Head>
  );
};

export default Meta;
