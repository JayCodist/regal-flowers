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
  title,
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
      <title>{title ? title : "Regal Flowers"}</title>

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta
        name="description"
        content={`${
          description
            ? description
            : "Order flowers and gifts online for same-day delivery or walk in 24/7. Send flowers to celebrate someone special from the top flower shop in Lagos & Abuja, Nigeria."
        }`}
      />

      {/* Open Graph Meta Tags */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {
        <meta
          property="og:image"
          content={
            image
              ? image
              : "https://www.regalflower.com/wp-content/uploads/2022/04/instablog9ja-16442864092140.jpg"
          }
        />
      }
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
