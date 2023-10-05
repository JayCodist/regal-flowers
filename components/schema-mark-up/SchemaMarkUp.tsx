interface SchemaMarkupProps {
  properties?: Record<string, any>;
}

const SchemaMarkup = ({}: SchemaMarkupProps) => {
  const schema = {
    "@context": "http://schema.org",
    "@type": "LocalBusiness",
    name: "Regal Flowers",
    url: "https://regalflowers.com.ng",
    telephone: [
      "+234 701 000 6664",
      "+234 701 000 6665",
      "+234 701 199 2888",
      "+234 911 200 0300"
    ],
    email: "info@regalflowers.com.ng",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress:
          "81b, Lafiaji Way, Dolphin Estate, Ikoyi, Lagos, Nigeria",
        addressLocality: "Ikoyi",
        addressRegion: "Lagos",
        postalCode: "Nigeria"
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Silverbird Galleria, 133, Ahmadu Bello Way",
        addressLocality: "Victoria Island",
        addressRegion: "Lagos",
        postalCode: "Nigeria"
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Muritala Muhammed Airport2",
        addressLocality: "Ikeja",
        addressRegion: "Lagos",
        postalCode: "Nigeria"
      },
      {
        "@type": "PostalAddress",
        streetAddress: "5, Nairobi Street, off Aminu Kano Crescent, Wuse 2",
        addressLocality: "Abuja",
        addressRegion: "Nigeria"
      }
    ],
    geo: [
      {
        "@type": "GeoCoordinates",
        latitude: "6.431916",
        longitude: "3.438313"
      },
      {
        "@type": "GeoCoordinates",
        latitude: "6.431130",
        longitude: "3.421499"
      },
      {
        "@type": "GeoCoordinates",
        latitude: "6.579768",
        longitude: "3.327780"
      },
      {
        "@type": "GeoCoordinates",
        latitude: "9.079727",
        longitude: "7.495671"
      }
    ],
    openingHours: "24/7",
    paymentAccepted: [
      "Credit/Debit Cards",
      "Paypal",
      "Bitcoin",
      "Bank Transfer"
    ],
    priceRange: "₦",
    description:
      "Order flowers and gifts online for same-day delivery or walk in 24/7. Send flowers to celebrate someone special from the top flower shop in Lagos & Abuja, Nigeria.",
    image: "/images/popular-bundled.jpg",
    sameAs: [
      "https://instagram.com/regalflowers.com.ng",
      "http://facebook.com/RegalFlowersNG/",
      "https://www.linkedin.com/company/regalflowers-com-ng/"
    ],
    hasMap: [
      "https://goo.gl/maps/cNB9Jx9sidQhJgtD6",
      "https://goo.gl/maps/AsSEYaBUVV3NCRaa7",
      "https://goo.gl/maps/5wQFMW5pR33n9k6G7",
      "https://goo.gl/maps/JAKrvZAe5vfh4czr9"
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+2347011992888",
        contactType: "customer service",
        url: "https://wa.me/+2347011992888"
      }
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
    logo: "/icons/logo.png"
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
