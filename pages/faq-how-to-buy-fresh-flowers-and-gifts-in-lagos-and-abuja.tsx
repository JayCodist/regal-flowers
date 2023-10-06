import { GetStaticProps } from "next";
import Link from "next/link";
import React, { FunctionComponent, useState } from "react";
import Button from "../components/button/Button";
import FlowerCard from "../components/flower-card/FlowerCard";
import {
  featuredSlugs,
  footerContent,
  gifts,
  paypalEmail,
  regalEmail,
  regalWebsiteUrl
} from "../utils/constants";
import { getProductsBySlugs } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";
import styles from "./faq.module.scss";
import Meta from "../components/meta/Meta";
import SchemaMarkup from "../components/schema-mark-up/SchemaMarkUp";

type ContentLink = "how-it-works" | "payment-methods" | "delivery";

const schemaProperties = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Regal Flowers?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Regal Flowers is a top flower shop in Lagos & Abuja, Nigeria. We offer fresh flowers and gifts for same-day delivery or walk-in."
      }
    },
    {
      "@type": "Question",
      name: "How can I order flowers and gifts?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You can order flowers and gifts online through our website 24/7, or you can visit one of our physical locations in Lagos and Abuja, Nigeria. We are open 24 hours, allowing you to walk in at any time or order online 24/7."
      }
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "We accept Credit/Debit Cards, Paypal, Bitcoin, and Bank Transfer."
      }
    },
    {
      "@type": "Question",
      name: "Do you offer same-day delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer same-day delivery across Lagos and Abuja, Nigeria."
      }
    },
    {
      "@type": "Question",
      name: "How do I buy fresh flowers from Regal Flowers?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You can buy fresh flowers from Regal Flowers by visiting our website or one of our physical locations in Lagos and Abuja. We offer a wide selection of fresh flowers for all occasions. We are open 24 hours, allowing you to walk in at any time or order online 24/7."
      }
    },
    {
      "@type": "Question",
      name: "Can I track my flower delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, you can track your flower delivery. We provide tracking information once your order is processed, allowing you to monitor the status of your delivery."
      }
    },
    {
      "@type": "Question",
      name: "Do you offer international flower delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "At the moment, we primarily offer flower delivery within Lagos and Abuja, Nigeria. However, please contact us for special inquiries regarding international flower delivery."
      }
    },
    {
      "@type": "Question",
      name: "How to send flowers to someone in Lagos or Abuja, Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sending flowers to someone in Lagos or Abuja, Nigeria is easy with Regal Flowers. You can place an order on our website 24/7 and select the delivery address within Lagos or Abuja. We offer same-day delivery to make your gesture even more special. Additionally, you can walk in 24 hours to our physical locations to purchase flowers."
      }
    },
    {
      "@type": "Question",
      name: "What are your opening hours?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "We are open 24 hours every day, including public holidays. You can shop for flowers and gifts at any time that is convenient for you. We welcome walk-ins 24 hours a day."
      }
    },
    {
      "@type": "Question",
      name: "How to send gifts to someone in Lagos or Abuja, Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sending gifts to someone in Lagos or Abuja, Nigeria is simple with Regal Flowers. Just visit our website, choose from our selection of gifts, and specify the delivery address within Lagos or Abuja. We'll ensure your gift is delivered promptly."
      }
    },
    {
      "@type": "Question",
      name: "Best flower shop in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Regal Flowers is widely recognized as the best flower shop in Lagos, Nigeria. We have the highest number of reviews and also the highest reviewed flower shop in the country across our branches. Our commitment to quality, same-day delivery, and our extensive selection of fresh flowers and gifts sets us apart. We've also had the privilege of delivering to various celebrities, including two Nigerian Presidents. Additionally, we are open 24 hours, making it convenient for you to choose and send flowers at any time."
      }
    },
    {
      "@type": "Question",
      name: "Best flower shop in Abuja?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Regal Flowers is also recognized as the best flower shop in Abuja, Nigeria. We are known for our exceptional service, high-quality flowers, and a wide range of gift options. Our reputation as the best flower shop in Abuja is backed by numerous positive reviews from satisfied customers. Additionally, we offer 24-hour service, making it convenient for you to shop for flowers and gifts at any time."
      }
    },
    {
      "@type": "Question",
      name: "Why are flowers so expensive in Lagos and Abuja, Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Flowers can be expensive in Lagos and Abuja, Nigeria due to factors such as import costs, transportation, unsteady electricity, and the high cost of refrigeration. However, at Regal Flowers, we strive to offer competitive prices while ensuring the freshest and most beautiful flowers for our customers. You can read more about this on our blog: <a href='https://regalflowers.com.ng/blog/why-are-flowers-so-expensive-in-nigeria/' target='_blank'>Why Are Flowers So Expensive in Nigeria?</a>"
      }
    }
  ],
  name: "Frequently Asked Questions - Regal Flowers",
  url:
    "https://regalflowers.com.ng/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja"
};

const Index: FunctionComponent<{ featuredFlowers: Product[] }> = ({
  featuredFlowers
}) => {
  const [activeContent, setActiveContent] = useState<ContentLink | null>(null);

  return (
    <>
      <Meta
        title="Frequently Asked Questions - Regal Flowers"
        description="How to Order Flowers and Gifts in Lagos and Abuja and Delivery Information | Regal Flowers & Gifts"
        canonicalUrl={`${regalWebsiteUrl}/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja`}
        url={`${regalWebsiteUrl}/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja`}
        image="/images/popular-bundled.jpg"
        imageAlt="Frequently Asked Questions - Regal Flowers"
      >
        <SchemaMarkup properties={schemaProperties} />
      </Meta>
      <section className={styles.wrapper}>
        <div className={[styles["hero-bg"], "hero-bg"].join(" ")}>
          <div className="hero-content flex column center center-align">
            <p className={styles.title}>Frequently Asked Questions</p>
          </div>
        </div>
        <div className={styles.container}>
          <div className={`${styles.content} flex between spaced-xl`}>
            <ol className={`flex column ${styles.links} normal-text`}>
              <p className="title small bold">Table of content</p>
              <Link href="#how-it-works">
                <a
                  className={`vertical-margin `}
                  onClick={() => setActiveContent("how-it-works")}
                >
                  <p
                    className={`${activeContent === "how-it-works" &&
                      "primary-color"}`}
                  >
                    <span className="margin-right">1</span> How to order flowers
                    and gifts for delivery
                  </p>
                </a>
              </Link>
              <Link href="#payment-methods">
                <a
                  className="margin-bottom"
                  onClick={() => setActiveContent("payment-methods")}
                >
                  <p
                    className={`${activeContent === "payment-methods" &&
                      "primary-color"}`}
                  >
                    <span className="margin-right">2</span> Payment Method
                  </p>
                </a>
              </Link>
              <Link href="#delivery">
                <a onClick={() => setActiveContent("delivery")}>
                  <p
                    className={`${activeContent === "delivery" &&
                      "primary-color"}`}
                  >
                    <span className="margin-right">3</span> Delivery
                  </p>
                </a>
              </Link>
            </ol>
            <div className={styles["linked-content"]}>
              <div id="how-it-works">
                <h1 className={`${styles.title}`}>
                  How to order flowers and gifts for delivery in Lagos and
                  Abuja, Nigeria
                </h1>
                <p className="margin-bottom spaced normal-text">
                  For delivery of{" "}
                  <Link href="/product-category/flowers-for-love-birthday-anniversary-etc">
                    <a className={styles.link}>fresh flowers</a>
                  </Link>{" "}
                  in Lagos, Nigeria or{" "}
                  <Link href="/">
                    <a className={styles.link}>fresh flowers</a>
                  </Link>{" "}
                  in Abuja, Nigeria:
                </p>
                <p className="normal-text">
                  Browse, and add your desired flowers and gifts to your cart
                  (don't forget to change the currency to USD if you are using a
                  Non-Naira card or Paypal). Proceed to checkout where you fill
                  in the delivery details (include the preferred pickup/delivery
                  date, recipient's phone number and your optional message), and
                  pay using any of the payment methods.
                  <br /> <br /> We can also work to suit your budget, desired
                  colours, flower types etc. Reach us at{" "}
                  <div
                    className={`${"flex between spaced column"} vertical-margin spaced`}
                  >
                    <div className="flex spaced-xl">
                      <Link href="tel:+2347011992888">
                        <a>
                          <img
                            className="generic-icon medium"
                            src="/icons/footer/phone.svg"
                            alt="phone"
                          />
                        </a>
                      </Link>

                      <Link href="https://wa.me/+2347011992888">
                        <a>
                          <img
                            className="generic-icon medium"
                            src="/icons/footer/whatsapp.svg"
                            alt="whtasapp"
                          />
                        </a>
                      </Link>
                    </div>
                    {footerContent.phoneNumbers.map(number => (
                      <a key={number} href={`tel:${number}`}>
                        {number}
                      </a>
                    ))}
                    <div className="flex spaced center-align">
                      <img
                        className="generic-icon"
                        src="/icons/footer/message.svg"
                        alt="message"
                      />
                      <a
                        href={`mailto:${regalEmail}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {regalEmail}
                      </a>
                    </div>
                  </div>{" "}
                  For any enquiries or to amend delivery details, message on the
                  flowers etc, feel free to reach out to us.
                </p>
              </div>
              <div id="payment-methods" className="">
                <p className={`${styles.title}`}>Payment Methods</p>
                <p className="title small bold margin-bottom">
                  What payment methods are available?
                </p>
                <p className="margin-bottom normal-text">
                  Online Payment Methods (Delivery fees included during
                  checkout)
                </p>
                <p className="margin-buttton flex align-center spaced normal-text">
                  <img
                    className="generic-icon medium"
                    src="./icons/bank-card.svg"
                    alt="card"
                  />
                  <span>Naira Mastercard/Visa/Verve Cards</span>
                </p>
                <p className="margin-buttton flex align-center spaced normal-text">
                  <img
                    className="generic-icon medium"
                    src="./icons/paypal.svg"
                    alt="paypal"
                  />{" "}
                  <span>
                    {" "}
                    Paypal/Other Credit Cards online (change currency to $ in
                    product page first){" "}
                  </span>
                </p>
                <div className={styles["payment-info"]}>
                  <strong className="primary-color normal-text">
                    Paypal to email{" "}
                  </strong>
                  <p className="normal-text">
                    Paypal Payment Address: <strong>{paypalEmail}</strong>
                  </p>
                </div>
                <p className="margin-buttton flex align-center spaced normal-text">
                  <img
                    className="generic-icon medium"
                    src="./icons/building.svg"
                    alt="paypal"
                  />{" "}
                  <span className="normal-text">
                    Transfer Methods (if applicable don't forget to include
                    delivery fees)
                  </span>
                </p>
                <div className={styles["payment-info"]}>
                  <strong className="primary-color margin-bottom normal-text">
                    Bank Transfers
                  </strong>
                  <p className="normal-text">
                    Bank Name: <strong>GTB</strong>
                  </p>
                  <p className="normal-text">
                    Account Name: <strong> REGAL FLOWERS LTD</strong>
                  </p>

                  <p className="normal-text">
                    Naira Account: <strong> 0252862666</strong>
                  </p>
                </div>
                <p className="margin-buttton flex align-center spaced normal-text">
                  <img
                    className="generic-icon medium"
                    src="./icons/bitcoin.svg"
                    alt="paypal"
                  />{" "}
                  <span>
                    <strong className="primary-color normal-text">
                      Bitcoins
                    </strong>
                    <br /> Wallet Address{" "}
                    <strong>12W9vKCcCbKFmYr9bYfbd9SqVvhyK5j4E1</strong>{" "}
                  </span>
                </p>
                <br />
                <p className="margin-buttton normal-text">
                  Of course, we are only a call/email away should you require
                  any assistance.
                </p>
              </div>
              <div id="delivery">
                <p className={`${styles.title}`}>Delivery</p>
                <p className="title small bold margin-bottom ">
                  Is same day flower delivery in Lagos, Nigeria and Abuja,
                  Nigeria possible?
                </p>
                <p className="margin-bottom spaced normal-text">
                  Yes, we usually offer same day flower delivery in Lagos,
                  Nigeria and Abuja, Nigeria However, we encourage you to{" "}
                  <Link href="/product-category/flowers-for-love-birthday-anniversary-etc">
                    <a className={styles.link}>order flowers</a>
                  </Link>{" "}
                  and{" "}
                  <Link href="/product-category/gifts">
                    <a className={styles.link}>gifts</a>
                  </Link>{" "}
                  as soon as possible due to traffic congestion, and to ensure
                  we don’t run out of stock for the day.
                </p>
                <p className="title small bold margin-bottom ">
                  Is a flower delivery in Lagos, Nigeria and Abuja, Nigeria
                  possible on weekends and public holidays?
                </p>
                <p className="margin-bottom normal-text">
                  Yes,{" "}
                  <Link href="/">
                    <a className={styles.link}>Regalflowers.com.ng</a>
                  </Link>{" "}
                  delivers flowers on all days INCLUDING Saturdays, Sundays, and
                  Public Holidays. Can't come in? You can always{" "}
                  <Link href="/">
                    <a className={styles.link}> buy flowers in Lagos</a>
                  </Link>{" "}
                  , Nigeria and Abuja, Nigeria from our online store or by phone
                  or WhatsApp and get them delivered.
                </p>
                <p className="title small bold margin-bottom ">
                  Do you deliver flowers outside Lagos, Nigeria and Abuja,
                  Nigeria e.g. Port Harcourt?
                </p>
                <p className="margin-bottom normal-text">
                  While we do not offer deliveries outside Lagos and Abuja at
                  the moment, we can however on a case-by-case basis, make use
                  of flights to send them to other states , subject to flight
                  availability.
                </p>
                <p className="normal-text">
                  If you prefer, you can also provide a representative in Lagos
                  or Abuja that we can deliver to, or you can engage a flight
                  courier at the airport (we can introduce you to one) who would
                  help fly the items to other states in Nigeria.
                </p>
                <p className="title small bold vertical-margin">
                  Why do you need the recipient's number for flower and gift
                  orders?
                </p>
                <p className="margin-bottom normal-text">
                  When our delivery partners (typically Uber and other 3rd party
                  delivery agents), get to the destination, they usually need to
                  communicate with the recipient to collect the{" "}
                  <Link href="/product-category/just-to-say-bouquets">
                    <a className={styles.link}>flowers</a>
                  </Link>{" "}
                  and{" "}
                  <Link href="/product-category/gifts">
                    <a className={styles.link}>gifts</a>
                  </Link>{" "}
                  , or to confirm who the recipient would prefer the driver drop
                  the items with.
                </p>
                <p className="normal-text">
                  In addition, as a security precaution many offices and
                  residences usually request that the driver put a call through
                  to the recipient before accepting the flowers and gifts.
                  Finally, there are sometimes issues with locating the given
                  address and the driver sometimes needs to communicate with the
                  recipient to clarify how to get to the address to complete the
                  delivery.
                </p>
                <p className="title small bold vertical-margin">
                  Who do you deliver the items to?
                </p>
                <p className="normal-text">
                  Our{" "}
                  <Link href="/">
                    <a className={styles.link}>
                      flower delivery in Abuja, Nigeria
                    </a>
                  </Link>{" "}
                  and Lagos, Nigeria is typically delivered directly to the
                  intended recipient. However, if they are unavailable for any
                  reason (meeting, phone off, not picking their calls etc), or
                  if they request we do so, we would deliver to their
                  receptionist, security guard, household staff, friend or
                  colleague at the delivery point.
                </p>
                <p className="title small bold vertical-margin">
                  What happens if the recipient doesn't pickup their phone, and
                  there is no one to drop the flowers with at the destination?
                </p>
                <p className="normal-text">
                  We usually at this point communicate with the sender on phone
                  to give an update on the situation. In the event the sender is
                  also unreachable for any reason, we would be forced to return
                  the items to our flower shop in Lagos, Nigeria, and Abuja,
                  Nigeria and the sender would then be required to pick them up,
                  or pay another delivery fee.
                </p>
                <p className="vertical-margin normal-text">
                  Due to the fact that our delivery partners are not able to
                  wait at the destination for an email response, we usually
                  return the flowers and gifts to our flower shop in Lagos,
                  Nigeria and Abuja, Nigeria if the mode of communication with
                  the sender was by email.
                </p>
                <p className="normal-text">
                  Due to the perishable nature of flowers and some gifts (
                  {gifts.map((gift, index) => (
                    <>
                      <Link href={gift.url} key={index}>
                        <a className={styles.link}>{gift.title}</a>
                      </Link>
                      ,{" "}
                    </>
                  ))}
                  ), items returned to our{" "}
                  <Link href="/">
                    <a className={styles.link}>flower shop in Abuja, Nigeria</a>
                  </Link>{" "}
                  and Lagos, Nigeria would be held for a limited amount of time
                  and might eventually wither at the buyers expense.
                </p>
              </div>
            </div>
          </div>
          <div className={`margin-bottom spaced ${styles["flowers-wrapper"]}`}>
            <span className={styles.title}>Featured Flowers</span>
            <Button
              url="/product-category/all"
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
          <div
            className={`${styles["flowers-wrapper"]} ${styles.wrap} ${styles["bottom-margin"]}`}
          >
            {featuredFlowers?.map(flower => (
              <FlowerCard
                key={flower.key}
                image={flower.images[0]?.src || ""}
                name={flower.name}
                subTitle={flower.details}
                price={flower.price}
                url={`/product/${flower.slug}`}
                buttonText="Add to Cart"
                cart={flower.variants?.length ? false : true}
              />
            ))}
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
