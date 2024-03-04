import { FunctionComponent, useContext, useState, useEffect } from "react";
import Button from "../components/button/Button";
import FlowerCard from "../components/flower-card/FlowerCard";
import styles from "./index.module.scss";
import {
  regalFeatures,
  regalOccasions,
  regalReasons,
  reviews,
  regalHowItWorks,
  regalAddresses,
  regalPhones,
  regalEmail,
  blogPosts,
  aboutUsContent,
  featuredSlugs,
  bestSellers,
  popularSections,
  mostLoved,
  allOccasionOptions,
  giftItems,
  bestSellersRomance,
  defaultBreadcrumb,
  regalWebsiteUrl,
  bestSellersOccasionTitle
} from "../utils/constants";
import ServiceCard from "../components/service-card/ServiceCard";
import OccasionCard from "../components/occasion-card/OccasionCard";
import BlogCard from "../components/blog-card/BlogCard";
import SettingsContext from "../utils/context/SettingsContext";
import Select, { PaginatedOptionsWrapper } from "../components/select/Select";
import DatePicker from "../components/date-picker/DatePicker";
import { getCategories } from "../utils/helpers/data/category";
import { FetchResourceParams } from "../utils/types/FetchResourceParams";
import { getProductsBySlugs } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";
import { LocationName } from "../utils/types/Regal";
import { GetStaticProps } from "next";
import useDeviceType from "../utils/hooks/useDeviceType";
import Link from "next/dist/client/link";
import SchemaMarkup from "../components/schema-mark-up/SchemaMarkUp";
import Meta from "../components/meta/Meta";

const schemaProperties = {
  "@type": "LocalBusiness",
  name: "Regal Flowers",
  url: "https://regalflowers.com.ng",
  description:
    "Order flowers and gifts online for same-day delivery or walk in 24/7. Send flowers to celebrate someone special from the top flower shop in Lagos & Abuja, Nigeria.",
  image: [
    "https://www.regalflower.com/wp-content/uploads/2022/04/instablog9ja-16442864092140.jpg"
  ],
  telephone: [
    "+234 701 000 6664",
    "+234 701 000 6665",
    "+234 701 199 2888",
    "+234 911 200 0300"
  ],
  email: "info@regalflowers.com.ng",
  openingHours: "24/7",
  paymentAccepted: ["Credit/Debit Cards", "Paypal", "Bitcoin", "Bank Transfer"],
  priceRange: "₦",
  hasMap: [
    "https://goo.gl/maps/cNB9Jx9sidQhJgtD6",
    "https://goo.gl/maps/AsSEYaBUVV3NCRaa7",
    "https://goo.gl/maps/5wQFMW5pR33n9k6G7",
    "https://goo.gl/maps/JAKrvZAe5vfh4czr9"
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "81b, Lafiaji Way, Dolphin Estate, Ikoyi, Lagos, Nigeria",
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
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+2347011992888",
      contactType: "customer service",
      url: "https://wa.me/+2347011992888"
    }
  ],
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
  logo:
    "https://drive.google.com/file/d/17_jCOCdRWr99w-_HDTjnf_5vlDD8wKwu/view?usp=drive_link"
};

const LandingPage: FunctionComponent<{
  locationName: LocationName;
  featuredBirthday?: Product[];
  featuredRomance?: Product[];
  featuredFlowers?: Product[];
  featuredOccasion?: Product[];
}> = ({
  featuredBirthday,
  locationName,
  featuredRomance,
  featuredOccasion
}) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const { setBreadcrumb } = useContext(SettingsContext);

  const deviceType = useDeviceType();

  useEffect(() => {
    setBreadcrumb(defaultBreadcrumb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Meta
        title="Regal Flowers | Same Day Flower Delivery Shop in Lagos and Abuja, Nigeria"
        description="Order flowers and gifts online for same-day delivery or walk in 24/7. Send flowers to celebrate someone special from the top flower shop in Lagos & Abuja, Nigeria."
        image="https://www.regalflower.com/wp-content/uploads/2022/04/instablog9ja-16442864092140.jpg"
        imageAlt="Regal Flowers"
        canonicalUrl={`${regalWebsiteUrl}`}
      >
        <SchemaMarkup properties={schemaProperties} />
      </Meta>

      <section className="page-content">
        <div
          className={[styles["hero-bg"], styles[locationName], "hero-bg"].join(
            " "
          )}
        >
          <div className="hero-content flex column center center-align">
            <h1 className={styles.title}>
              They Deserve Regal Flowers.
              <br /> Premium Same Day Flower Delivery in Lagos & Abuja, Nigeria
              <br /> This Mother's Day
            </h1>
            <FlowerDeliveryInput />
          </div>
        </div>
        <section className="featured-section-wrapper home-page">
          <div className="featured-content">
            <div className="flex between">
              <h2 className="featured-title">{bestSellers[locationName]}</h2>
              {deviceType === "desktop" && (
                <Button
                  url="/product-category/flowers-for-love-birthday-anniversary-etc"
                  className="flex spaced center-align"
                  type="transparent"
                >
                  <h3 className="red margin-right">See All</h3>
                  <img
                    alt="arrow"
                    className="generic-icon xsmall"
                    src="/icons/arrow-right.svg"
                  />
                </Button>
              )}
            </div>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {featuredBirthday?.map(flower => (
                <FlowerCard
                  key={flower.key}
                  image={flower.images[0]?.src || ""}
                  name={flower.name.split("–")[0]}
                  subTitle={flower.subtitle || flower.name.split("–")[1]}
                  price={flower.price}
                  url={`/product/${flower.slug}`}
                  buttonText={
                    flower.variants?.length ? "Select Size" : "Add to Cart"
                  }
                  cart={flower.variants?.length ? false : true}
                  product={flower}
                />
              ))}
            </div>
            {deviceType === "mobile" && (
              <Button
                url="/product-category/flowers-for-love-birthday-anniversary-etc"
                type="accent"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}
            <>
              <div className="flex between">
                <h2 className="featured-title">{bestSellersOccasionTitle}</h2>
                {deviceType === "desktop" && (
                  <Button
                    url="/product-category/valentines-day-flowers-and-gifts"
                    className="flex spaced center-align"
                    type="transparent"
                  >
                    <h3 className="red margin-right">See All</h3>
                    <img
                      alt="arrow"
                      className="generic-icon xsmall"
                      src="/icons/arrow-right.svg"
                    />
                  </Button>
                )}
              </div>
              <div className={[styles.section, styles.wrap].join(" ")}>
                {featuredOccasion?.map(flower => (
                  <FlowerCard
                    key={flower.key}
                    image={flower.images[0]?.src || ""}
                    name={flower.name.split("–")[0]}
                    subTitle={flower.subtitle || flower.name.split("–")[1]}
                    price={flower.price}
                    url={`/product/${flower.slug}`}
                    buttonText={
                      flower.variants?.length ? "Select Size" : "Add to Cart"
                    }
                    cart={flower.variants?.length ? false : true}
                    product={flower}
                  />
                ))}
              </div>
              {deviceType === "mobile" && (
                <Button
                  // url="/product-category/valentines-day-flowers-and-gifts"
                  type="accent"
                  minWidth
                  className={styles["see-all"]}
                >
                  <h3 className="red margin-right">See All</h3>
                </Button>
              )}
            </>
            <div className="flex between">
              <h2 className="featured-title">
                {bestSellersRomance[locationName]}
              </h2>
              {deviceType === "desktop" && (
                <Button
                  url="/product-category/just-to-say-bouquets"
                  className="flex spaced center-align"
                  type="transparent"
                >
                  <h3 className="red margin-right">See All</h3>
                  <img
                    alt="arrow"
                    className="generic-icon xsmall"
                    src="/icons/arrow-right.svg"
                  />
                </Button>
              )}
            </div>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {featuredRomance?.map(flower => (
                <FlowerCard
                  key={flower.key}
                  image={flower.images[0]?.src || ""}
                  name={flower.name.split("–")[0]}
                  subTitle={flower.subtitle || flower.name.split("–")[1]}
                  price={flower.price}
                  url={`/product/${flower.slug}`}
                  buttonText={
                    flower.variants?.length ? "Select Size" : "Add to Cart"
                  }
                  cart={flower.variants?.length ? false : true}
                  product={flower}
                />
              ))}
            </div>
            {deviceType === "mobile" && (
              <Button
                url="/product-category/flowers-for-love-birthday-anniversary-etc"
                type="accent"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}
            <div className="flex between">
              <h2 className="featured-title">Gifts to Include with Flowers</h2>
              {deviceType === "desktop" && (
                <Button
                  url="/product-category/gifts"
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
              )}
            </div>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {giftItems.map(gift => (
                <FlowerCard
                  key={gift.name}
                  image={gift.image}
                  name={gift.name}
                  subTitle={gift.description}
                  url={gift.slug}
                  buttonText="See More"
                />
              ))}
            </div>

            {deviceType === "mobile" && (
              <Button
                url="/product-category/gifts"
                type="accent"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}
            {deviceType === "desktop" && (
              <div className={styles.section}>
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
            )}
            <div className="flex between">
              <h2 className="featured-title">Featured Occasions</h2>
              {deviceType === "desktop" && (
                <Button
                  url="/product-category/all"
                  className="flex spaced center-align"
                  type="transparent"
                >
                  <h3 className="red margin-right">See All</h3>
                  <img
                    alt="arrow"
                    className="generic-icon xsmall"
                    src="/icons/arrow-right.svg"
                  />
                </Button>
              )}
            </div>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {regalOccasions.map(occasion => (
                <OccasionCard
                  key={occasion.title}
                  title={occasion.title}
                  url={occasion.url}
                  image={occasion.image}
                />
              ))}
            </div>
            {deviceType === "mobile" && (
              <Button
                url="/product-category/all"
                type="accent"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}

            <br />
            <h2 className="featured-title">Popular Sections</h2>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {popularSections.map(section => (
                <FlowerCard
                  key={section.title}
                  image={section.image}
                  name={section.title}
                  url={section.url}
                  mode="four-x-grid"
                  onlyTitle
                  buttonText="Add to Cart"
                />
              ))}
            </div>
          </div>
          <div className={styles["full-width-section"]}>
            <div className={styles.left}>
              <div
                className={`flex center spaced-lg center-align ${deviceType ===
                  "mobile" && "column text-center"}`}
              >
                <h2
                  className={`featured-title ${
                    deviceType === "desktop" ? "half-width" : "block"
                  }`}
                >
                  {mostLoved[locationName]}
                </h2>
                <div className="flex column spaced center-align">
                  <span className="larger margin-bottom">Customer Reviews</span>
                  <a
                    href="https://google.com"
                    target="_blank"
                    className={styles["google-review"]}
                    rel="noreferrer"
                  >
                    <img
                      alt="stars"
                      src="/icons/stars.png"
                      className="generic-icon medium margin-bottom"
                    />
                    <div className="flex spaced center-align">
                      <img
                        className="generic-icon large"
                        src="/icons/google.svg"
                        alt="google"
                      />
                      <span className={styles.stats}>
                        <strong>4.9 </strong> <span>from 1000+ reviews</span>
                      </span>
                    </div>
                  </a>
                </div>
              </div>
              <br /> <br />
              <div className={styles.reviews}>
                {reviews[locationName]?.map((review, i) => (
                  <div
                    key={i}
                    className={[
                      styles.review,
                      i === currentReviewIndex && styles.active
                    ].join(" ")}
                  >
                    <div className="flex spaced">
                      {Array(review.rating)
                        .fill("")
                        .map((_, index) => (
                          <img
                            key={index}
                            className="generic-icon"
                            alt="star"
                            src="/icons/star.svg"
                          />
                        ))}
                      {Array(5 - review.rating)
                        .fill("")
                        .map((_, index) => (
                          <img
                            key={index}
                            className="generic-icon"
                            alt="star"
                            src="/icons/star-white.svg"
                          />
                        ))}
                    </div>
                    <span className={styles.text}>“{review.text}”</span>
                    {review.user.avatar ? (
                      <img
                        className="generic-icon large"
                        alt="review user"
                        src={review.user.avatar}
                      />
                    ) : (
                      <span className={styles.avatar}>
                        {review.user.name[0]}
                      </span>
                    )}
                    <strong className="vertical-margin compact">
                      {review.user.name}
                    </strong>
                    <span className={styles["review-date"]}>{review.date}</span>
                  </div>
                ))}
              </div>
              {currentReviewIndex > 0 && (
                <img
                  className={[
                    styles["review-arrow"],
                    styles["left-arrow"]
                  ].join(" ")}
                  alt="previous"
                  role="button"
                  onClick={() => setCurrentReviewIndex(currentReviewIndex - 1)}
                  src="/icons/arrow-right-circled.svg"
                />
              )}
              {currentReviewIndex < reviews[locationName].length - 1 && (
                <img
                  className={styles["review-arrow"]}
                  alt="next"
                  src="/icons/arrow-right-circled.svg"
                  role="button"
                  onClick={() => setCurrentReviewIndex(currentReviewIndex + 1)}
                />
              )}
              <div className="flex spaced-lg">
                {reviews[locationName]?.map((_, index) => (
                  <span
                    key={index}
                    role="button"
                    onClick={() => setCurrentReviewIndex(index)}
                    className={[
                      styles.dot,
                      index === currentReviewIndex && styles.active
                    ].join(" ")}
                  ></span>
                ))}
              </div>
            </div>
            {deviceType === "desktop" && (
              <img
                className={styles.right}
                src={reviews[locationName][currentReviewIndex].image}
                alt="review"
              />
            )}
          </div>

          <div className="featured-content white-bg">
            <h2 className="featured-title text-center">
              Why Send with Regal Flowers
            </h2>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {regalReasons.map(reason => (
                <ServiceCard
                  title={reason.title}
                  key={reason.title}
                  subtitle={reason.subtitle}
                  image={reason.image}
                  size="default"
                />
              ))}
            </div>

            {deviceType === "desktop" && (
              <>
                <h2 className="featured-title text-center">How It Works</h2>
                <div className={styles.section}>
                  {regalHowItWorks.map(reason => (
                    <ServiceCard
                      title={reason.title}
                      key={reason.title}
                      subtitle={reason.subtitle}
                      image={reason.image}
                      size="default"
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div
            className={[styles["full-width-section"], styles.summary].join(" ")}
          >
            <div className={styles.left}>
              <strong className="featured-title-small">
                NOT JUST FLOWERS. REGAL FLOWERS
              </strong>
              <h2 className="featured-title">Now Let’s Send Yours</h2>
              <span className="normal-text">
                There's a reason people love Regal Flowers. ..because we make
                every flower and gift delivery a special experience. We didn't
                say so, the various recipients of our flowers did.
              </span>
              <Button
                padded
                url="/product-category/flowers-for-love-birthday-anniversary-etc"
              >
                Send Flowers
              </Button>
            </div>
            <img
              className={styles.right}
              src="/images/landing-summary.png"
              alt="review"
            />
          </div>

          <div className={[styles["summary-mobile"], ""].join(" ")}>
            <div>
              <strong className="featured-title-small">
                NOT JUST FLOWERS. REGAL FLOWERS
              </strong>
              <h2 className="featured-title">Now Let’s Send Yours</h2>
              <span className="normal-text">
                There's a reason people love Regal Flowers. ..because we make
                every flower and gift delivery a special experience. We didn't
                say so, the various recipients of our flowers did.
              </span>
              <Button
                padded
                url="/product-category/flowers-for-love-birthday-anniversary-etc"
              >
                Send Flowers
              </Button>
            </div>
          </div>

          <div className={styles["contact-section-wrapper"]}>
            <div className={styles["contact-section"]} id="contactSection">
              <img
                src="/images/landing-contact.png"
                className={styles["contact-img"]}
                alt="welcoming flower"
              />
              <div className={styles.details}>
                <strong>GET IN TOUCH</strong>
                <h2 className="featured-title vertical-margin spaced">
                  Contact Us Today!
                </h2>
                {regalAddresses.map(address => (
                  <div key={address.name} className={styles.detail}>
                    <strong className={styles.key}>{address.name}</strong>
                    <span className={styles.value}>
                      <img
                        className="generic-icon margin-right"
                        src="/icons/map-drop.svg"
                        alt="location"
                      />
                      <span className="flex column spaced">
                        <a href={address.url} target="_blank" rel="noreferrer">
                          {address.location}
                        </a>
                        <span className="grayed">{address.workingTimes}</span>
                      </span>
                    </span>
                  </div>
                ))}

                <div className={styles.detail}>
                  <strong className={styles.key}>
                    Contact (Calls and WhatsApp)
                  </strong>
                  <span className={styles.value}>
                    <span className="flex spaced">
                      <img
                        alt="phone"
                        src="/icons/phone-solid.svg"
                        className="generic-icon"
                      />
                      <span className="flex column spaced">
                        {regalPhones.map(phone => (
                          <a
                            key={phone}
                            href={`tel:${phone.replace(/[^\d\+]/g, "")}`}
                          >
                            {phone}
                          </a>
                        ))}
                      </span>
                    </span>
                  </span>
                </div>

                <div className={styles.detail}>
                  <strong className={styles.key}>Email</strong>
                  <span className={styles.value}>
                    <span className="flex spaced center-align">
                      <img
                        alt="phone"
                        src="/icons/envelope.svg"
                        className="generic-icon"
                      />
                      <a
                        href={`mailto:${regalEmail}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {regalEmail}
                      </a>
                    </span>
                  </span>
                </div>

                <Button
                  type="accent"
                  className={styles["hello-btn"]}
                  padded
                  url="https://wa.me/+2347011992888"
                >
                  <img
                    src="/icons/whatsapp-green.svg"
                    alt="whatsapp"
                    className="margin-right"
                  />
                  Say Hello
                </Button>
              </div>
            </div>
          </div>

          <div
            className={[styles["mobile-contact-details"], "mobile-margin"].join(
              " "
            )}
          >
            <strong>GET IN TOUCH</strong>
            <h2 className=" vertical-margin spaced">Contact Us Today!</h2>
            {regalAddresses.map(address => (
              <div key={address.name} className={[styles.detail].join(" ")}>
                <strong className={styles.key}>{address.name}</strong>
                <span className={styles.value}>
                  <img
                    className="generic-icon margin-right"
                    src="/icons/map-drop.svg"
                    alt="location"
                  />
                  <span className="flex column spaced">
                    <a href={address.url} target="_blank" rel="noreferrer">
                      {address.location}
                    </a>
                    <span className="grayed">{address.workingTimes}</span>
                  </span>
                </span>
              </div>
            ))}

            <div className={styles.detail}>
              <strong className={styles.key}>
                Contact (Calls and WhatsApp)
              </strong>
              <span className={styles.value}>
                <span className="flex spaced">
                  <img
                    alt="phone"
                    src="/icons/phone-solid.svg"
                    className="generic-icon"
                  />
                  <span className="flex column spaced">
                    {regalPhones.map(phone => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/[^\d\+]/g, "")}`}
                      >
                        {phone}
                      </a>
                    ))}
                  </span>
                </span>
              </span>
            </div>

            <div className={styles.detail}>
              <strong className={styles.key}>Email</strong>
              <span className={styles.value}>
                <span className="flex spaced center-align">
                  <img
                    alt="phone"
                    src="/icons/envelope.svg"
                    className="generic-icon"
                  />
                  <a
                    href={`mailto:${regalEmail}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {regalEmail}
                  </a>
                </span>
              </span>
            </div>

            <Button type="accent" className="margin-top" padded>
              Say Hello
            </Button>
          </div>

          {deviceType === "desktop" && (
            <div className="featured-content">
              <h2 className="featured-title text-center margin-bottom spaced">
                Our Blog
              </h2>
              <div className={styles.section}>
                {blogPosts.map(post => (
                  <BlogCard
                    key={post.title}
                    title={post.title}
                    readDuration={post.readDuration}
                    date={post.date}
                    image={post.image}
                    excerpt={post.excerpt}
                    url="#"
                  />
                ))}
              </div>
            </div>
          )}
          <h2 className="featured-title text-center margin-bottom spaced">
            About Us
          </h2>
          <div className={[styles["about-section"], "white-bg"].join(" ")}>
            <div>
              <p className="title small bold margin-bottom">
                {aboutUsContent.howItBegan.title}
              </p>
              <p className="normal-text">
                It was a Sunday morning, the year was 2016, in the vibrant city
                of Lagos, Nigeria, and our founder, reeling from the very recent
                heartbreak of his relationship (Hint: She left him) was
                determined to get his girlfriend back.
                <br />
                <br />
                She was traveling to Abuja, Nigeria that afternoon, and he
                wanted to buy fresh flowers for her so he decided to check
                prices of bouquet of flowers online. He specifically wanted
                flower shops in Lagos or Abuja that could deliver a bouquet of{" "}
                <Link href="/product/classic-red-roses-luxurious-bouquet-of-red-roses">
                  <a className={styles.red}>red roses</a>
                </Link>{" "}
                and chocolates to her the same day.
                <br />
                <br />
                He searched high and low, and while he found some online flower
                delivery shops in Lagos and Abuja, Nigeria, he couldn’t find one
                that ticked all the right boxes.
                <br />
                <br />
                The flower shops he found either didn’t look reputable enough
                (after all he was already heartbroken, he couldn’t afford to
                lose his money too, and this is Nigeria, where you have to be
                vigilant), were not picking up or returning his calls, or they
                didn’t have enough options for various budgets.
                <br />
                <br />
                He finally found one that claimed to be open 24 hours on their
                Google Maps, and when they also didn’t pick up the phone, he
                drove down there, only to meet it closed. Ouch.
                <br />
                <br />
                No, he eventually didn’t get her back, and No, it wasn't because
                he couldn't send her the red roses and chocolates.
                <br />
                <br />
                Instead, it was, as the dictionary would say, irreconcilable
                differences, and they remain friends, but he instead gained the
                passion for flowers and gifts that would eventually see him open
                his own online and walk-in fresh flower shop in Lagos and Abuja,
                Nigeria.
                <br />
                An online flower shop that would precisely tick all the right
                boxes.
              </p>
              <p className="title small bold vertical-margin xl margin-bottom spaced">
                {aboutUsContent.openingHour.title}
              </p>
              <p className="normal-text">
                Our flower shops in Lagos (Ikoyi Head office) and Abuja (Wuse 2
                Branch) are open 24 hours not only for website orders but also
                for walk-ins. We once had a client take us up on the offer by
                walking in by 3 am. He was on his way to pick up his wife at the
                airport and wanted to buy red roses to welcome her. He was
                shocked we were actually open.
                <br />
                <br />
                Many clients are often surprised that unlike others out there,
                it is not just a slogan for us.
                <br />
                <br />
                Regal Flowers and Gifts is also open every day of the year
                including weekends and public holidays (yes, Christmas, Easter,
                and New Year's Day too). We are badass like that
              </p>
            </div>
            <div>
              <p className="title small bold vertical-margin xl margin-bottom spaced">
                {aboutUsContent.reputation.title}
              </p>
              <p className="normal-text">
                Once you place your order, you can completely relax, as we
                deliver on time, and you can walk into any of our branches
                anytime. We have the highest rating (4.97 stars on average) and
                the highest number of Google Reviews in Nigeria (over 1000
                reviews from our 4 branches).
                <br />
                <br />
                Regal Flowers has delivered to over 10,000 people including
                various celebrities and 2 Nigerian Presidents. We have very
                likely delivered roses for and to someone you know.
                <br />
                <br />
                Furthermore, the flowers are always fresh and imported into
                Nigeria every week from rose farms across the world. You can
                definitely say Regal flowers is your plug for reputable and
                premium fresh flowers in Nigeria.
              </p>
              <p className="title small bold vertical-margin xl margin-bottom spaced">
                {aboutUsContent.deliveryTime.title}
              </p>
              <p className="normal-text">
                We offer fast and same-day delivery of{" "}
                <Link href="/product-category/just-to-say-bouquets">
                  <a className={styles.red}>flower bouquets</a>
                </Link>{" "}
                and gifts everywhere in Lagos and Abuja. <br /> <br />
                Some locations we offer delivery of fresh flowers in Lagos
                include Ikoyi, Victoria Island, Ikeja, Lekki Phase 1, Chevron,
                Lekki, Ajah, Ikate, Sangotedo, Gbagada, Yaba, Surulere, Ilupeju,
                Magodo, Maryland, Opebi, Ogba, Ogudu, Allen Avenue.
                <br /> <br />
                We opened our Abuja branch in 2021 and it is also open for
                walk-ins 24 hours. We offer delivery of fresh flowers everywhere
                in Abuja, including in Wuse 2, Maitama, Central Area, Garki,
                Jabi, Asokoro, Gwarinpa, Jahi, Lokogoma, Apo, Life Camp, Lugbe,
                Dawaki, Abuja Municipal Area Council etcetera.
                <br /> <br />
                In essence, we deliver EVERYWHERE in Lagos and Abuja
              </p>
              <p className="title small bold vertical-margin xl margin-bottom spaced">
                {aboutUsContent.budget.title}
              </p>
              <p className="normal-text">
                We stock flowers for various occasions such as{" "}
                <Link href="/product-category/flowers-for-love-birthday-anniversary-etc">
                  <a className={styles.red}>
                    Birthday Flowers, Romantic Flowers, Anniversary Flowers
                  </a>
                </Link>
                , Mothers’ Day Flowers, Get Well Soon Flowers,{" "}
                <Link href="/product-category/funeral-and-condolence">
                  <a className={styles.red}>
                    {" "}
                    Funeral Wreaths, Condolence Flowers
                  </a>
                </Link>{" "}
                <Link href="/product-category/bridal-bouquets">
                  <a className={styles.red}>Bridal Bouquets</a>
                </Link>{" "}
                , and of course,{" "}
                <Link href="/product-category/valentines-day-flowers-and-gifts">
                  <a className={styles.red}> Valentine’s Day flowers</a>
                </Link>{" "}
                available
                <br />
                <br />
                And finally, there are suitable options for all budgets, so when
                you see a design you like, you can simply pick the size that
                suits your budget. Want to go all out too? We got you, with our{" "}
                <Link href="/vip">
                  <a className={styles.red}>VIP</a>
                </Link>{" "}
                Category of roses.
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

// const occasionOptions = regalOccasions.map(occasion => ({
//   ...occasion,
//   label: occasion.title,
//   value: occasion.title
// }));

const FlowerDeliveryInput: FunctionComponent = () => {
  const [occasion, setOccasion] = useState<{ value: number; slug: string }>({
    value: 0,
    slug: ""
  });
  const { deliveryDate, setDeliveryDate } = useContext(SettingsContext);
  const [occassionOptions, setOccassionOptions] = useState<
    PaginatedOptionsWrapper
  >({
    options: []
  });

  const deviceType = useDeviceType();

  const fetchCategories = async (props?: FetchResourceParams) => {
    const { pageNumber = 1, pageSize = 10, mergeRecords } = props || {};
    const response = await getCategories({ pageNumber, pageSize });
    const { data, error } = response;

    if (error) {
      return;
    } else if (data) {
      const category = data.map(category => ({
        value: category.id,
        label: category.name
      }));

      const options = [
        ...(mergeRecords ? occassionOptions.options : []),
        ...category
      ];

      setOccassionOptions({ options, hasNext: data.length > 0 });
    }
  };

  const handleOnselect = (value: string) => {
    const selectedOccasion = allOccasionOptions.find(
      _occasion => _occasion.value === value
    );

    setOccasion({
      value: selectedOccasion?.value as number,
      slug: selectedOccasion?.value as string
    });
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["flower-input-wrapper"]}>
      <div className="block">
        <Select
          options={allOccasionOptions}
          value={occasion.value}
          onSelect={value => handleOnselect(value as string)}
          className={styles["occasion-select"]}
          placeholder={
            deviceType === "desktop" ? "Select Occasion" : "Occasion"
          }
          startIcon="/icons/bullet-points.svg"
          hideCaret
        />
        <DatePicker
          value={deliveryDate}
          onChange={setDeliveryDate}
          format="D MMM YYYY"
          className={styles["occasion-date"]}
          placeholder="Delivery Date"
          dropdownAlignment={deviceType === "mobile" ? "right" : "left"}
          iconAtLeft
          disablePastDays
        />
      </div>
      <Button
        padded
        url={`/product-category/${occasion?.slug ||
          "flowers-for-love-birthday-anniversary-etc"}`}
        className={styles["occasion-submit"]}
      >
        Send Flowers
      </Button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const locationName = "featured-birthday";
  const featuredRomance = await getProductsBySlugs(
    featuredSlugs["featured-romance"]
  );

  const { data, error, message } = await getProductsBySlugs(
    featuredSlugs[locationName]
  );

  const featuredOccasion = await getProductsBySlugs(
    featuredSlugs["featured-occasion"]
  );

  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }

  return {
    props: {
      locationName: "general",
      featuredBirthday: data || [],
      featuredRomance: featuredRomance.data || [],
      featuredOccasion: featuredOccasion.data || []
    }
  };
};

export default LandingPage;
