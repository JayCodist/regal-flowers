import { GetStaticProps } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { brochureSlides, featuredSlugs, toUse } from "../utils/constants";
import { getProductsBySlugs } from "../utils/helpers/data/products";
import styles from "./faq.module.scss";
import { DeliveryIcon } from "../utils/resources";

type ContentLink =
  | "to-use"
  | "free-valentine-delivery"
  | "flower-section"
  | "whyRegal"
  | "gifts-section"
  | "further-enquiry";

const Index = () => {
  const [activeContent, setActiveContent] = useState<ContentLink | null>(null);

  return (
    <>
      <section className={styles.wrapper}>
        <div className={[styles["hero-bg"], "hero-bg"].join(" ")}>
          <div className="hero-content flex column center center-align">
            <p className={styles.title}>
              REGAL FLOWER BOUQUETS AND GIFT PRODUCTS SUMMARY
            </p>
          </div>
        </div>
        <div className={styles.container}>
          <div className={`${styles.content} flex between spaced-xl`}>
            <ol className={`flex column ${styles.links} normal-text`}>
              <p className="title small bold">Table of content</p>
              <Link href="#to-use">
                <a
                  className={`vertical-margin `}
                  onClick={() => setActiveContent("to-use")}
                >
                  <p
                    className={`${activeContent === "to-use" &&
                      "primary-color"}`}
                  >
                    <span className="margin-right">1</span> To Use
                  </p>
                </a>
              </Link>
              <Link href="#flower-section">
                <a
                  onClick={() => setActiveContent("flower-section")}
                  className={`margin-bottom `}
                >
                  <p
                    className={`${activeContent === "flower-section" &&
                      "primary-color"}`}
                  >
                    <span className="margin-right">2</span> Flower Section
                  </p>
                </a>
              </Link>
              <Link href="#gifts-section">
                <a
                  onClick={() => setActiveContent("gifts-section")}
                  className={`margin-bottom `}
                >
                  <p
                    className={`${activeContent === "gifts-section" &&
                      "primary-color"}`}
                  >
                    <span className="margin-right">3</span> Gift Section
                  </p>
                </a>
              </Link>
              <Link href="#footer">
                <a onClick={() => setActiveContent("further-enquiry")}>
                  <p
                    className={`${activeContent === "further-enquiry" &&
                      "primary-color"}`}
                  >
                    <span className="margin-right">4</span> Further Enquiry
                  </p>
                </a>
              </Link>
            </ol>
            <div className={styles["linked-content"]}>
              <div id="to-use">
                <h1 className={`${styles.title}`}>TO USE:</h1>
                <ul>
                  {toUse.map((item, index) => (
                    <li key={index} className="normal-text">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div id="free-valentine-delivery" className="normal-text">
                <p
                  className={`flex spaced center-align text-medium ${styles.info}`}
                >
                  <DeliveryIcon />
                  <span>
                    Free Valentine Delivery (13th-15th Feb) across Lagos/Abuja
                    on Orders above N165,000 ($255//£210)
                  </span>
                </p>

                <div className={styles["payment-info"]}>
                  If you were chatting with us (e.g. on Instagram), that’s fine
                  too (please note there might be some delays in response due to
                  the season), simply mention the Product name and preferred
                  size, and our Admins would take your order.
                </div>

                <div className={`title small bold margin-bottom `}>
                  Have questions? Pls see our contact details at the extreme
                  bottom of the page.
                </div>
              </div>
              <div id="flower-section">
                {brochureSlides.map((slide, index) => (
                  <div
                    key={index}
                    className="slide-wrapper"
                    id={slide?.id || ""}
                  >
                    <p className={`${styles["title"]} margin-bottom spaced`}>
                      {slide.sectionName}
                    </p>
                    <div>
                      {slide.slides.map((flower, index) => (
                        <div key={index} className="slide">
                          <div className="margin-bottom spaced">
                            <p className={`title small bold `}>{flower.name}</p>
                            <hr />
                          </div>
                          {flower.info && (
                            <p
                              className={`${styles.info} margin-bottom spaced`}
                            >
                              {flower.info}
                            </p>
                          )}
                          <Link href={flower.url}>
                            <a>
                              <img src={flower.image} alt="flower" />
                            </a>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error, message } = await getProductsBySlugs(
    featuredSlugs["featured-birthday"]
  );
  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }
  return {
    props: {
      featuredFlowers: data || []
    }
  };
};

export default Index;
