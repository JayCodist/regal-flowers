import { FunctionComponent, useContext, useState, useEffect } from "react";
import Button from "../components/button/Button";
import FlowerCard from "../components/flower-card/FlowerCard";
import styles from "./index.module.scss";
import {
  regalFeatures,
  regalOccasions,
  regalReasons,
  sampleReviews,
  featuredAddons,
  regalHowItWorks,
  regalAddresses,
  regalPhones,
  regalEmail,
  blogPosts,
  aboutUsContent
} from "../utils/constants";
import ServiceCard from "../components/service-card/ServiceCard";
import OccasionCard from "../components/occasion-card/OccasionCard";
import BlogCard from "../components/blog-card/BlogCard";
import SettingsContext from "../utils/context/SettingsContext";
import Select, { PaginatedOptionsWrapper } from "../components/select/Select";
import DatePicker from "../components/date-picker/DatePicker";
import { getCategory } from "../utils/helpers/data/category";
import { FetchResourceParams } from "../utils/types/FetchResourceParams";
import { Category } from "../utils/types/Category";
import { getAllProducts } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";

const LandingPage: FunctionComponent<{
  featuredFlowers: Product[];
}> = props => {
  const { featuredFlowers } = props;

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  return (
    <section className="page-content">
      <div className={[styles["hero-bg"], "hero-bg"].join(" ")}>
        <div className="hero-content flex column center center-align">
          <h1 className={styles.title}>
            Same Day Flower Delivery <br />
            In Lagos & Abuja, Nigeria.
          </h1>
          <FlowerDeliveryInput />
        </div>
      </div>
      <section className="featured-section-wrapper">
        <div className="featured-content-wrapper">
          <div className="featured-content">
            <div className="flex between">
              <h2 className="featured-title">Best Selling Flowers</h2>
              <Button
                url="/filters?selectedOccasion=all-occasions"
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
            <div className={styles.section}>
              {featuredFlowers?.map(flower => (
                <FlowerCard
                  key={flower.key}
                  image={flower.images[0]?.src || ""}
                  name={flower.name}
                  subTitle={flower.details}
                  price={flower.price}
                  url={`/products/${flower.slug}`}
                />
              ))}
            </div>
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
            <div className="flex between">
              <h2 className="featured-title">Featured Occasions</h2>
              <Button
                url="/filters?selectedOccasion=all-occasions"
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
            <div className={styles.section}>
              {regalOccasions.map(occasion => (
                <OccasionCard
                  key={occasion.title}
                  title={occasion.title}
                  url={occasion.url}
                  image={occasion.image}
                />
              ))}
            </div>
          </div>
          <div className={styles["full-width-section"]}>
            <div className={styles.left}>
              <div className="flex center spaced-lg center-align">
                <h2 className="featured-title half-width">
                  We're the most-loved online flower shop in Lagos & Abuja,
                  Nigeria.
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
                {sampleReviews.map((review, i) => (
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
                    <img
                      className="generic-icon large"
                      alt="review user"
                      src={review.user.avatar}
                    />
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
              {currentReviewIndex < sampleReviews.length - 1 && (
                <img
                  className={styles["review-arrow"]}
                  alt="next"
                  src="/icons/arrow-right-circled.svg"
                  role="button"
                  onClick={() => setCurrentReviewIndex(currentReviewIndex + 1)}
                />
              )}
              <div className="flex spaced-lg">
                {sampleReviews.map((_, index) => (
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
            <img
              className={styles.right}
              src="/images/reviews-1.png"
              alt="review"
            />
          </div>

          <div className="featured-content">
            <h2 className="featured-title text-center">
              Why Send with Regal Flowers
            </h2>
            <div className={styles.section}>
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

            <div className="flex between">
              <h2 className="featured-title">Gifts to Include with Flowers</h2>
              <Button
                url="/filters?selectedOccasion=all-occasions"
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
            <div className={styles.section}>
              {featuredAddons.map(addonGroup => (
                <FlowerCard
                  key={addonGroup.name}
                  image={addonGroup.image}
                  name={addonGroup.name}
                  subTitle={addonGroup.description}
                  url={addonGroup.slug}
                  buttonText="See more"
                />
              ))}
            </div>

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
          </div>

          <div
            className={[styles["full-width-section"], styles.summary].join(" ")}
          >
            <div className={styles.left}>
              <strong>WORK WITH US</strong>
              <h2 className="featured-title">Now Let’s Send Yours</h2>
              <span>
                The gradual accumulation of information about atomic and
                small-scale behavior during the first quarter of the 20th{" "}
              </span>
              <Button padded url="/filters">
                Send Flowers
              </Button>
            </div>
            <img
              className={styles.right}
              src="/images/landing-summary.png"
              alt="review"
            />
          </div>

          <div className={styles["contact-section-wrapper"]}>
            <div className={styles["contact-section"]}>
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
                        <a
                          href={`https://maps.google.com?q=${address.location}`}
                          target="_blank"
                          rel="noreferrer"
                        >
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
            </div>
          </div>

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
            <h2 className="featured-title text-center margin-bottom spaced">
              About Us
            </h2>
            <div className="flex between spaced-xl xl">
              <div className="half-width">
                <p className="title small bold margin-bottom">
                  {aboutUsContent.howItBegan.title}
                </p>
                <p>{aboutUsContent.howItBegan.content}</p>
                <p className="title small bold vertical-margin">
                  {aboutUsContent.openingHour.title}
                </p>
                <p>{aboutUsContent.openingHour.content}</p>
              </div>
              <div className="half-width">
                <p className="title small bold margin-bottom">
                  {aboutUsContent.reputation.title}
                </p>
                <p>{aboutUsContent.reputation.content}</p>
                <p className="title small bold vertical-margin">
                  {aboutUsContent.deliveryTime.title}
                </p>
                <p>{aboutUsContent.deliveryTime.content}</p>
                <p className="title small bold vertical-margin">
                  {aboutUsContent.budget.title}
                </p>
                <p>{aboutUsContent.budget.content}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

// const occasionOptions = regalOccasions.map(occasion => ({
//   ...occasion,
//   label: occasion.title,
//   value: occasion.title
// }));

const FlowerDeliveryInput: FunctionComponent = () => {
  const [occasion, setOccasion] = useState<Category>({ name: "", id: "" });
  const { deliveryDate, setDeliveryDate } = useContext(SettingsContext);
  const [occassionOptions, setOccassionOptions] = useState<
    PaginatedOptionsWrapper
  >({
    options: []
  });

  const fetchCategories = async (props?: FetchResourceParams) => {
    const { pageNumber = 1, pageSize = 10, mergeRecords } = props || {};
    const response = await getCategory({ pageNumber, pageSize });
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
    const _selectedOccasion = occassionOptions.options.find(
      _occasion => _occasion.value === value
    )?.label as string;

    setOccasion(
      {
        name: _selectedOccasion,
        id: value
      } || null
    );
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["flower-input-wrapper"]}>
      <Select
        options={occassionOptions.options}
        value={occasion.id}
        onSelect={value => handleOnselect(value as string)}
        className={styles["occasion-select"]}
        placeholder="Select Occasion"
        startIcon="/icons/bullet-points.svg"
        hideCaret
        onScrollEnd={occassionOptions.hasNext ? fetchCategories : undefined}
      />
      <DatePicker
        value={deliveryDate}
        onChange={setDeliveryDate}
        format="D MMM YYYY"
        className={styles["occasion-date"]}
        placeholder="Delivery Date"
        iconAtLeft
      />
      <Button
        padded
        url={`/filters?selectedOccasion=${occasion?.name || ""}`}
        className={styles["occasion-submit"]}
      >
        Send Flowers
      </Button>
    </div>
  );
};

export async function getStaticProps() {
  const response = await getAllProducts();

  if (response.data) {
    const featuredFlowers = response?.data
      ?.filter((product: Product) => product.featured)
      .slice(0, 4);

    return {
      props: {
        featuredFlowers
      }
    };
  }

  return {
    props: {
      featuredFlowers: null
    }
  };
}

export default LandingPage;
