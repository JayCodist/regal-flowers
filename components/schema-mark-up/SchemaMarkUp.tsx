interface SchemaMarkupProps {
  properties?: Record<string, any>;
}

const SchemaMarkup = ({ properties }: SchemaMarkupProps) => {
  const schema = {
    "@context": "http://schema.org",
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
