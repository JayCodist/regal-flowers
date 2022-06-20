import { FunctionComponent, useState } from "react";
import Button from "../components/button/Button";
import Product from "../utils/types/Product";
import FlowerCard from "../components/flower-card/FlowerCard";
import { otherSampleProducts } from "./filters/[filter]";
import styles from "./index.module.scss";
import { regalFeatures } from "../utils/constants";
import ServiceCard from "../components/service-card/ServiceCard";

const flowers: Product[] = [
  {
    ...otherSampleProducts,
    id: 11,
    name: "5 Peas in a pod",
    price: 6000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "5 peas in a pod",
        id: 1,
        src: "/images/sample-flowers/sample-1.png"
      }
    ]
  },
  {
    ...otherSampleProducts,
    id: 12,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "5 peas in a pod",
        id: 1,
        src: "/images/sample-flowers/sample-2.png"
      }
    ]
  },
  {
    ...otherSampleProducts,
    id: 13,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "5 peas in a pod",
        id: 1,
        src: "/images/sample-flowers/sample-3.png"
      }
    ]
  },
  {
    ...otherSampleProducts,
    id: 16,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "5 peas in a pod",
        id: 1,
        src: "/images/sample-flowers/sample-4.png"
      }
    ]
  }
];

const LandingPage: FunctionComponent = () => {
  const [featuredFlowers] = useState(flowers);
  return (
    <section className="page-content">
      <div className={[styles["hero-bg"], "hero-bg"].join(" ")}>
        <div className="hero-content flex column center center-align">
          <h1 className={styles.title}>
            Same Day Flower Delivery <br />
            In Lagos & Abuja, Nigeria.
          </h1>
        </div>
      </div>
      <section className="featured-section-wrapper">
        <div className="featured-content">
          <div className="flex between">
            <h2 className="featured-title">Best Selling Flowers</h2>
            <Button
              url="/filters/occassions"
              className="flex spaced center center-align"
              type="transparent"
            >
              <h3 className="red margin-right">See All</h3>
              <img
                alt="arrow"
                className="generic-icon xsmall"
                src="/icons/arrow-right.svg"
              />
            </Button>
          </div>

          <div className="flex between vertical-margin wide">
            {featuredFlowers.map(flower => (
              <FlowerCard
                key={flower.id}
                image={flower.images[0]?.src || ""}
                name={flower.name}
                subTitle={flower.details}
                price={flower.price}
                url={`/products/${flower.slug}`}
              />
            ))}
          </div>

          <br />
          <br />
          <div className="flex between vertical-margin wide">
            {regalFeatures.map(feature => (
              <ServiceCard
                title={feature.title}
                key={feature.title}
                subtitle={feature.subtitle}
                image={feature.image}
                size="small"
              />
            ))}
          </div>
          <br />
        </div>
      </section>
    </section>
  );
};

export default LandingPage;
