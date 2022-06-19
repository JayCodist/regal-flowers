import { FunctionComponent, useState } from "react";
import { GetStaticProps } from "next";
import { getProduct } from "../../utils/helpers/data/products";
import Product, { DesignOption } from "../../utils/types/Product";
import styles from "./products.module.scss";
import Button from "../../components/Button/Button";
import FlowerCard from "../../components/FlowerCard/FlowerCard";
import { flowers } from "../filters/[filter]";

const LandingPage: FunctionComponent<{ product: Product }> = () => {
  const productSampleData: Product = {
    id: 1,
    name: "A Kiss of Rose",
    addonsGroups: [
      {
        name: "Perfumes",
        image: "/images/addons/Rectangle133.png",
        addons: [
          {
            name: "5 Peas in a pod",
            price: 32999,
            image: "/images/addons/Rectangle131.png"
          },
          {
            name: "5 Peas in a pod",
            price: 36000,
            image: "/images/addons/Rectangle13.png"
          }
        ]
      },
      {
        name: "Teady Bears",
        image: "/images/addons/Rectangle133.png",
        addons: [
          {
            name: "5 Peas in a pod",
            price: 32999,
            image: "/images/addons/Rectangle131.png"
          },
          {
            name: "5 Peas in a pod",
            price: 36000,
            image: "/images/addons/Rectangle13.png"
          }
        ]
      }
    ],
    featured: true,
    images: [
      { alt: "flower1", src: "/images/product-image/flower1.png", id: 1 },
      { alt: "flower2", src: "/images/addons/Rectangle131.png", id: 2 },
      { alt: "flower3", src: "/images/flower.png", id: 3 },
      { alt: "flower4", src: "/images/product-image/flower1.png", id: 4 }
    ],
    price: 70000,
    salePrice: 80000,
    sku: "u2i2093092",
    slug: "ejodei-iejeo-ooeoei",
    type: "variable",
    variants: [
      { name: "Small (15 Roses)", price: 75000, class: "regular" },
      { name: "Medium (20 Roses)", price: 90000, class: "vip" }
    ],
    productDescription:
      "A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.",
    title: "A Kiss of Rose",
    sizes: [
      "Entry (5 roses)",
      "Extra Small (10 roses)",
      "Small (15 roses)",
      "Medium (20 roses)",
      "Standard (24cm box)",
      "Standard Plus (27cm box)",
      "Standard Premium (30cm box)",
      "VIP Entry",
      "VIP Medium",
      "VIP Standard",
      "VIP Standard Premium",
      "VIP Large"
    ],
    designOptions: ["wrappedBouquet", "invase", "inLargeVase", "box"],
    note:
      "Single stem rose only available for pickup, except as part of larger order.",
    description:
      "A kiss from a rose is daintily presented single full stemmed rose, available in various colors.",
    details: "5 Peas in a pod"
  };

  const [product] = useState<Product>(productSampleData);
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [descriptionTab, setDescriptionTab] = useState("product description");
  const [sizeType, setsizeType] = useState<string>("regular");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [addonGroup, setAddonGroup] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<DesignOption>(
    "wrappedBouquet"
  );
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
        <span className="generic-icon small margin-left">{product.title}</span>
      </div>
      <div className={`${styles["product-content"]} flex between`}>
        <div>
          <div className={styles.slider}>
            <button
              onClick={handlePreviousCLick}
              className={`${styles["btn-arrow"]}  ${
                styles["left"]
              } ${activeSlide <= 1 && "disabled"}`}
            >
              <img
                src="/icons/chevron-left.svg"
                alt="left"
                className={"genric-icon"}
              />
            </button>
            {product.images.map((image, index) => (
              <div
                key={index}
                className={[
                  styles["slide"],
                  activeSlide === image.id && styles["active-slide"]
                ].join(" ")}
              >
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
            <button
              onClick={handleNextCLick}
              className={`${styles["btn-arrow"]} ${
                styles["right"]
              } ${activeSlide >= product.images.length && "disabled"}`}
            >
              <img
                src="/icons/chevron-right.svg"
                alt="right"
                className="genric-icon"
              />
            </button>
          </div>
          <div className="flex between spaced">
            {product.images.map((image, index) => (
              <img
                onClick={() => handleActiveSlide(image.id)}
                src={image.src}
                alt={image.alt}
                key={index}
                className={[
                  styles["slide-image"],
                  activeSlide === image.id && styles["active-image"]
                ].join(" ")}
              />
            ))}
          </div>
          <div className={`${styles["tab"]} flex spaced`}>
            <button
              onClick={() => setDescriptionTab("product description")}
              className={`${
                descriptionTab === "product description" ? styles.active : null
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setDescriptionTab("reviews")}
              className={`${
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
              <h1 className="title">{product.title}</h1>
              <p>Single stem rose available in red, white, pink and yellow.</p>
            </div>
            <div className="bold primary-color center">
              <p>FROM</p>
              <p className="larger">₦36,000</p>
            </div>
          </div>
          <p
            className={`${styles["product-info"]} flex spaced vertical-margin`}
          >
            <img
              src="/icons/info.svg"
              alt="information"
              className="generic-icon"
            />
            <span>{product.note}</span>
          </p>
          <p className="bold margin-bottom">Description</p>
          <p>{product.description}</p>
          {product.type === "variable" && (
            <div>
              <p className="align-icon margin-top">
                <span className="bold margin-right">Select Budget</span>
                <img
                  src="/icons/info.svg"
                  alt="information"
                  className="generic-icon"
                />{" "}
              </p>
              <br />
              <div className={`${styles["tab"]} flex spaced`}>
                <button
                  onClick={() => setsizeType("regular")}
                  className={`${sizeType === "regular" ? styles.active : null}`}
                >
                  Regular Sizes
                </button>
                <button
                  onClick={() => setsizeType("vip")}
                  className={`${sizeType === "vip" ? styles.active : null}`}
                >
                  VIP Sizes
                </button>
              </div>
              {sizeType === "regular" && (
                <div className={styles["size-wrapper"]}>
                  {product.sizes?.map((size, index) => (
                    <span
                      key={index}
                      className={[
                        styles.size,
                        selectedSize === size && styles["selected-size"]
                      ].join(" ")}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}

              {sizeType === "vip" && <div>Coming Soon</div>}

              <br />

              {product.designOptions?.length && (
                <p className="align-icon vertical-margin">
                  <span className="bold margin-right">Select Design</span>
                  <img
                    src="/icons/info.svg"
                    alt="information"
                    className="generic-icon"
                  />{" "}
                </p>
              )}
              <div className="flex spaced">
                {product.designOptions?.map((designOption, index) => (
                  <>
                    {designOption === "wrappedBouquet" && (
                      <div
                        key={index}
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
                    {designOption === "invase" && (
                      <div
                        key={index}
                        className={[
                          styles.design,
                          selectedDesign === "invase" &&
                            styles["selected-design"]
                        ].join(" ")}
                        onClick={() => setSelectedDesign("invase")}
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
                  </>
                ))}
              </div>
            </div>
          )}

          <div className={styles["menu-wrapper"]}>
            <p className="bold vertical-margin spaced">
              Awesome Gifts to Include
            </p>
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
                    className={`${styles.group} ${group.name === addonGroup &&
                      styles.active} flex between center-align`}
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
          <div className="flex spaced vertical-margin spaced">
            <Button type="transparent">Buy Now</Button>
            <Button responsive>Add to Cart (₦36,000)</Button>
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
            details={item.details}
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
  return {
    paths: [
      {
        params: {
          productSlug:
            "belleza-regal-two-colors-rose-red-yellow-white-pink-orange"
        }
      }
    ],
    fallback: false // true or 'blocking'
  };
};

export default LandingPage;
