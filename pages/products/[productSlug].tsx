import { Fragment, FunctionComponent, useState } from "react";
import { GetStaticProps } from "next";
import { getAllProducts, getProduct } from "../../utils/helpers/data/products";
import Product, { DesignOption } from "../../utils/types/Product";
import styles from "./products.module.scss";
import Button from "../../components/button/Button";
import FlowerCard from "../../components/flower-card/FlowerCard";
import { flowers } from "../filters/[filter]";

const LandingPage: FunctionComponent<{ product: Product }> = props => {
  const { product } = props;

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [descriptionTab, setDescriptionTab] = useState("product description");
  const [sizeType, setsizeType] = useState<string>("regular");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [addonGroup, setAddonGroup] = useState("");
  const [selectedDesign, setSelectedDesign] =
    useState<DesignOption>("wrappedBouquet");
  const handleNextCLick = () => {
    setActiveSlide(activeSlide + 1);
  };

  const handlePreviousCLick = () => {
    setActiveSlide(activeSlide - 1);
  };

  const handleActiveSlide = (id: number) => {
    setActiveSlide(id);
  };

  return (
    <section className={`${styles.product}`}>
      <div className="margin-bottom spaced">
        <span className="margin-right align-icon">
          Home{" "}
          <img
            src="/icons/chevron-right.svg"
            alt="right"
            className="generic-icon small margin-left"
          />
        </span>
        <span className="margin-right align-icon">
          Love, Birthdays & Anniversary{" "}
          <img
            src="/icons/chevron-right.svg"
            alt="right"
            className="generic-icon small margin-left"
          />
        </span>
        <span className="generic-icon small margin-left">{product.name}</span>
      </div>
      <div className={`${styles["product-content"]} flex between`}>
        <div className={styles["slider-wrapper"]}>
          <div className={styles.slider}>
            <button
              onClick={handlePreviousCLick}
              className={`${styles["btn-arrow"]}  ${styles["left"]} ${
                activeSlide <= 1 && "disabled"
              }`}
            >
              <img
                src="/icons/chevron-left.svg"
                alt="left"
                className={"generic-icon"}
              />
            </button>
            {product.images.map((image, index) => (
              <div
                key={index}
                className={[
                  styles["slide"],
                  activeSlide === index && styles["active-slide"]
                ].join(" ")}
              >
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
            <button
              onClick={handleNextCLick}
              className={`${styles["btn-arrow"]} ${styles["right"]} ${
                activeSlide >= product.images.length - 1 && "disabled"
              }`}
            >
              <img
                src="/icons/chevron-right.svg"
                alt="right"
                className="generic-icon"
              />
            </button>
          </div>
          <div className={`${styles.images}`}>
            {product.images.map((image, index) => (
              <img
                onClick={() => handleActiveSlide(index)}
                src={image.src}
                alt={image.alt}
                key={index}
                className={[
                  styles["slide-image"],
                  activeSlide === index && styles["active-image"]
                ].join(" ")}
              />
            ))}
          </div>
          <div className={`${styles["tab"]} flex spaced`}>
            <button
              onClick={() => setDescriptionTab("product description")}
              className={`${styles["tab-title"]} ${
                descriptionTab === "product description" ? styles.active : null
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setDescriptionTab("reviews")}
              className={`${styles["tab-title"]} ${
                descriptionTab === "reviews" ? styles.active : null
              }`}
            >
              Reviews
            </button>
          </div>
          {descriptionTab === "product description" && (
            <p>{product.productDescription}</p>
          )}

          {descriptionTab === "reviews" && <p>Coming Soon</p>}
          <div className={`${styles.delivery} flex spaced`}>
            <div className={styles.icon}>
              <img
                className={`generic-icon medium`}
                src="/icons/truck.svg"
                alt="truck"
              />
            </div>
            <div>
              <p className="smaller bold">Delivery</p>
              <p>Estimated delivery time: 1 - 7 days</p>
            </div>
          </div>
          <div className={`${styles["social-icons"]} flex spaced center-align`}>
            <span>Share: </span>
            <span className={`${styles["social-icon"]}`}>
              <img src="/icons/twitter.svg" alt="twitter" />
            </span>
            <span className={`${styles["social-icon"]}`}>
              <img src="/icons/whatsapp.svg" alt="whatsapp" />
            </span>
            <span className={`${styles["social-icon"]}`}>
              <img src="/icons/facebook.svg" alt="facebook" />
            </span>
          </div>
        </div>
        <div>
          <div className="flex center-align between">
            <div>
              <h1 className="title">{product.name}</h1>
              <p>{product.subtitle}</p>
            </div>
            <div className="bold primary-color center">
              <p>FROM</p>
              <p className="larger">₦{product.price}</p>
            </div>
          </div>
          <p
            className={`${styles["product-info"]} center-align flex spaced vertical-margin`}
          >
            <img
              src="/icons/info.svg"
              alt="information"
              className="generic-icon"
            />
            <span>{product.note}</span>
          </p>
          <h3 className="bold margin-bottom">Description</h3>
          <p>{product.description}</p>
          {product.type === "variable" && (
            <div>
              <div className="align-icon margin-top">
                <h3 className="bold margin-right">Select Budget</h3>
                <img
                  src="/icons/info.svg"
                  alt="information"
                  className="generic-icon"
                />{" "}
              </div>
              <br />
              <div className={`${styles["tab"]} flex spaced`}>
                <button
                  onClick={() => setsizeType("regular")}
                  className={`${styles["tab-title"]} ${
                    sizeType === "regular" ? styles.active : null
                  }`}
                >
                  Regular Sizes
                </button>
                <button
                  onClick={() => setsizeType("vip")}
                  className={`${styles["tab-title"]} ${
                    sizeType === "vip" ? styles.active : null
                  }`}
                >
                  VIP Sizes
                </button>
              </div>
              {sizeType === "regular" && (
                <div className={styles["size-wrapper"]}>
                  {product.variants?.map((variant, index) => (
                    <span
                      key={index}
                      className={[
                        styles.size,
                        selectedSize === variant.name && styles["selected-size"]
                      ].join(" ")}
                      onClick={() => setSelectedSize(variant.name)}
                    >
                      {variant.name}
                    </span>
                  ))}
                </div>
              )}

              {sizeType === "vip" && <div>Coming Soon</div>}

              <br />

              {product.designOptions?.length && (
                <div className="align-icon vertical-margin">
                  <h3 className="bold margin-right">Select Design</h3>
                  <img
                    src="/icons/info.svg"
                    alt="information"
                    className="generic-icon"
                  />{" "}
                </div>
              )}
              <div className="flex spaced">
                {product.designOptions?.map((designOption, index) => (
                  <Fragment key={index}>
                    {designOption === "wrappedBouquet" && (
                      <div
                        className={[
                          styles.design,
                          selectedDesign === "wrappedBouquet" &&
                            styles["selected-design"]
                        ].join(" ")}
                        onClick={() => setSelectedDesign("wrappedBouquet")}
                      >
                        <img
                          src="/icons/wrapped-bouquet.svg"
                          alt="box"
                          className="generic-icon xxl margin-bottom spaced"
                        />
                        <p className="vertical-margin bold">Wrapped Bouquet</p>
                        <p>+₦0</p>
                      </div>
                    )}
                    {designOption === "inVase" && (
                      <div
                        key={index}
                        className={[
                          styles.design,
                          selectedDesign === "inVase" &&
                            styles["selected-design"]
                        ].join(" ")}
                        onClick={() => setSelectedDesign("inVase")}
                      >
                        <img
                          src="/icons/invase.svg"
                          alt="box"
                          className="generic-icon xxl margin-bottom spaced"
                        />
                        <p className="vertical-margin bold">In a Vase</p>
                        <p>+₦15,000</p>
                      </div>
                    )}
                    {designOption === "inLargeVase" && (
                      <div
                        key={index}
                        className={[
                          styles.design,
                          selectedDesign === "inLargeVase" &&
                            styles["selected-design"]
                        ].join(" ")}
                        onClick={() => setSelectedDesign("inLargeVase")}
                      >
                        <img
                          src="/icons/large-vase.svg"
                          alt="box"
                          className="generic-icon xxl margin-bottom spaced"
                        />
                        <p className="vertical-margin bold">In Large Vase</p>
                        <p>+₦30,000</p>
                      </div>
                    )}
                    {designOption === "box" && (
                      <div
                        key={index}
                        className={[
                          styles.design,
                          selectedDesign === "box" && styles["selected-design"]
                        ].join(" ")}
                        onClick={() => setSelectedDesign("box")}
                      >
                        <img
                          src="/icons/box.svg"
                          alt="box"
                          className="generic-icon xxl margin-bottom spaced"
                        />
                        <p className="vertical-margin bold">Box Arrangement</p>
                        <p>Complimentary</p>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          )}

          <div className={styles["menu-wrapper"]}>
            <h3 className="bold vertical-margin spaced">
              Awesome Gifts to Include
            </h3>
            {product.addonsGroups.map((group, index) => (
              <div key={index}>
                {" "}
                <div
                  className={`${styles["menu-btn"]} flex`}
                  onClick={() =>
                    setAddonGroup(group.name === addonGroup ? "" : group.name)
                  }
                >
                  <img
                    className="generic-icon xl"
                    src={group.image}
                    alt={group.name}
                  />
                  <div
                    className={`${styles.group} ${
                      group.name === addonGroup && styles.active
                    } flex between center-align`}
                  >
                    <p className="bold">{group.name}</p>
                    <svg
                      className={`${
                        group.name === addonGroup ? styles.arrow : null
                      }`}
                      width="8"
                      height="12"
                      viewBox="0 0 8 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.00009 0L0.590088 1.41L5.17009 6L0.590088 10.59L2.00009 12L8.00009 6L2.00009 0Z"
                        fill="#4B5563"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className={[
                    styles["menu-dropdown"],
                    group.name === addonGroup && styles.opened
                  ].join(" ")}
                >
                  {group.addons.map((addon, index) => (
                    <div key={index} className={styles["menu-child"]}>
                      <img src={addon.image} alt={addon.name} />
                      <div className="vertical-margin">
                        <p className="bold margin-bottom">{addon.name}</p>
                        <p>{addon.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex spaced vertical-margin block">
            <Button url="/checkout" className={styles["buy-now"]} type="accent">
              <strong>Buy Now</strong>
            </Button>
            <Button url="/checkout" className={styles["add-to-cart"]}>
              <strong>Add to Cart (₦36,000)</strong>
            </Button>
          </div>
        </div>
      </div>
      <p className="title bold margin-top spaced">Related Products</p>
      <div className="flex between vertical-margin spaced wrap">
        {flowers.map((item, index) => (
          <FlowerCard
            key={index}
            name={item.name}
            image={item.images[0].src}
            price={item.price}
            subTitle={item.details}
            url={`/products/${item.slug}`}
          />
        ))}
      </div>
    </section>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { productSlug } = params || {};
  const { data, error, message } = await getProduct(String(productSlug));
  if (error || !data) {
    console.error(`Unable to fetch product "${productSlug}": ${message}`);
    return {
      props: {}
    };
  }
  return {
    props: { product: data }
  };
};

export const getStaticPaths = async () => {
  const { data, error } = await getAllProducts();
  const slugs = data?.map(product => ({
    params: { productSlug: product.slug }
  }));

  if (error) {
    console.error(`Unable to fetch products: ${error}`);
    return {
      paths: []
    };
  } else {
    return {
      paths: slugs,
      fallback: false // true or 'blocking'
    };
  }
};

export default LandingPage;
