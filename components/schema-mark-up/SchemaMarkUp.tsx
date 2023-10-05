interface SchemaMarkupProps {
  properties?: Record<string, any>;
}

const SchemaMarkup = ({ properties }: SchemaMarkupProps) => {
  const schema = {
    "@context": "http://schema.org",
    sameAs: [
      "https://instagram.com/regalflowers.com.ng",
      "http://facebook.com/RegalFlowersNG/",
      "https://www.linkedin.com/company/regalflowers-com-ng/"
    ],
    potentialAction: [
      {
        "@type": "ViewAction",
        target:
          "https://regalflowers.com.ng/product-category/flowers-for-love-birthday-anniversary-etc",
        name: "Love, Birthday, Anniversary Flowers"
      },
      {
        "@type": "ViewAction",
        target: "https://regalflowers.com.ng/product-category/gifts",
        name: "Gifts to Include"
      },
      {
        "@type": "ViewAction",
        target:
          "https://regalflowers.com.ng/product-category/just-to-say-bouquets",
        name: "Popular Options"
      },
      {
        "@type": "ViewAction",
        target: "https://regalflowers.com.ng/product-category/roses",
        name: "Roses"
      }
    ],
    logo: "/icons/logo.png",
    ...properties
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      key="structured-data"
    ></script>
  );
};

export default SchemaMarkup;
