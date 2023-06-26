import { FunctionComponent, useContext, useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { getAllProducts, getProduct } from "../../utils/helpers/data/products";
import Product, { DesignOptionName } from "../../utils/types/Product";
import styles from "./products.module.scss";
import Button from "../../components/button/Button";
import FlowerCard from "../../components/flower-card/FlowerCard";
import SettingsContext from "../../utils/context/SettingsContext";
import { CartItem } from "../../utils/types/Core";
import { getPriceDisplay } from "../../utils/helpers/type-conversions";
import useDeviceType from "../../utils/hooks/useDeviceType";
import { DesignOption } from "../../utils/constants";
import Link from "next/dist/client/link";

interface Size {
  name: string;
  price: number;
  designOptions?: DesignOption[];
}

const ProductPage: FunctionComponent<{ product: Product }> = props => {
  const { product } = props;

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [descriptionTab] = useState("product description");
  const [sizeType, setsizeType] = useState("regular");
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [addonGroup, setAddonGroup] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<DesignOption | null>(
    null
  );
  const [productPrice, setProductPrice] = useState<number>(product.price);
  const [total, setTotal] = useState<number>(product.price);

  const {
    setCartItems,
    cartItems,
    notify,
    currency,
    shouldShowCart,
    setShouldShowCart,
    redirect
  } = useContext(SettingsContext);
  const deviceType = useDeviceType();

  console.log("rediredct", redirect);

  const shouldShowRegularSizes = product.variants?.some(
    variant => variant.class === "regular"
  );

  const shouldShowVipSizes = product.variants?.some(
    variant => variant.class === "vip"
  );

  useEffect(() => {
    const longDescription = document.getElementById("long-description");
    const description = document.getElementById("description");
    if (longDescription) {
      longDescription.innerHTML = product.longDescription.replace(
        "<p>&nbsp;</p>",
        ""
      );
    }

    if (description) {
      description.innerHTML = product.description.replace("<p>&nbsp;</p>", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!shouldShowRegularSizes) {
      setsizeType("vip");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = () => {
    const productKey = `${product.key}${selectedSize?.name ||
      ""}${selectedDesign?.name || ""}`.replace(/\s/g, "");
    const cartItem: CartItem = {
      key: product.key,
      name: product.name,
      price: productPrice,
      size: selectedSize?.name,
      design: selectedDesign
        ? {
            quantity: 1,
            name: selectedDesign?.name as DesignOptionName,
            price: selectedDesign?.price as number,
            title: selectedDesign?.title as string
          }
        : null,
      quantity: 1,
      image: {
        src: product.images[0].src,
        alt: product.images[0].alt
      },
      cartId: productKey
    };

    const existingCartItem = cartItems.find(item => item.cartId === productKey);
    const existingDesign = existingCartItem?.design;

    if (!existingCartItem) {
      setCartItems([...cartItems, cartItem]);
      notify(
        "success",
        <p>
          Item Added To Cart{" "}
          <span
            className="view-cart"
            onClick={() => setShouldShowCart(!shouldShowCart)}
          >
            View Cart
          </span>
        </p>
      );
    } else {
      if (existingCartItem.size !== selectedSize?.name) {
        setCartItems([...cartItems, cartItem]);
        notify(
          "success",
          <p>
            Item Added To Cart{" "}
            <span
              className="view-cart"
              onClick={() => setShouldShowCart(!shouldShowCart)}
            >
              View Cart
            </span>
          </p>
        );
      } else if (existingCartItem.name === selectedSize?.name) {
        const newCartItem = cartItems.map(item => {
          if (item.key === existingCartItem?.key) {
            return {
              ...item,
              quantity: item.quantity + 1
            };
          } else {
            return item;
          }
        }) as CartItem[];

        setCartItems(newCartItem);
        notify(
          "success",
          <p>
            Item Added To Cart{" "}
            <span
              className="view-cart"
              onClick={() => setShouldShowCart(!shouldShowCart)}
            >
              View Cart
            </span>
          </p>
        );
      } else if (existingDesign?.name === selectedDesign?.name) {
        const newCartItem = cartItems.map(item => {
          if (item.key === existingCartItem?.key) {
            return {
              ...item,
              quantity: item.quantity + 1,
              design: {
                ...item.design,
                quantity: (item.design?.quantity as number) + 1
              }
            };
          } else {
            return item;
          }
        }) as CartItem[];
        setCartItems(newCartItem);
        notify(
          "success",
          <p>
            Item Added To Cart{" "}
            <span
              className="view-cart"
              onClick={() => setShouldShowCart(!shouldShowCart)}
            >
              View Cart
            </span>
          </p>
        );
      } else if (
        existingDesign?.name !== selectedDesign?.name &&
        selectedDesign
      ) {
        setCartItems([...cartItems, cartItem]);

        notify(
          "success",
          <p>
            Item Added To Cart{" "}
            <span
              className="view-cart"
              onClick={() => setShouldShowCart(!shouldShowCart)}
            >
              View Cart
            </span>
          </p>
        );
      }
    }
    setSelectedSize(null);
    setSelectedDesign(null);
  };

  const handleNextCLick = () => {
    setActiveSlide(activeSlide + 1);
  };

  const handlePreviousCLick = () => {
    setActiveSlide(activeSlide - 1);
  };

  const handleActiveSlide = (id: number) => {
    setActiveSlide(id);
  };

  const pickDefaultDesign = () => {
    if (selectedSize?.designOptions) {
      const defaultDesign = selectedSize.designOptions.find(
        design => design.default
      );
      setSelectedDesign(defaultDesign || null);
    }
  };

  useEffect(() => {
    pickDefaultDesign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize]);

  useEffect(() => {
    setActiveSlide(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    setTotal((selectedDesign?.price || 0) + (selectedSize?.price || 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDesign, selectedSize]);

  const cannotBuy =
    (product.type === "variable" && !selectedSize?.name) ||
    (selectedSize?.designOptions && !selectedDesign);

  return (
    <section className={`${styles.product}`}>
      <div className={`margin-bottom spaced ${styles.padding}`}>
        <div className="margin-right align-icon">
          <Link href="/">
            <a>Home</a>
          </Link>
          <img
            src="/icons/chevron-right.svg"
            alt="right"
            className="generic-icon small margin-left"
          />
        </div>
        <div className="margin-right align-icon">
          <Link href={redirect.url}>
            <a>{redirect.title}</a>
          </Link>
          <img
            src="/icons/chevron-right.svg"
            alt="right"
            className="generic-icon small margin-left"
          />
        </div>
        <span className="generic-icon small margin-left">
          {product.name.split("–")[0]}
        </span>
      </div>
      <div
        className={`${
          styles["product-content"]
        } flex spaced-xl between ${deviceType === "mobile" && "column"}`}
      >
        <div className={styles["slider-wrapper"]}>
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
              className={`${styles["btn-arrow"]} ${
                styles["right"]
              } ${activeSlide >= product.images.length - 1 && "disabled"}`}
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
          {deviceType === "desktop" && (
            <>
              <br />

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
              <div
                className={`${styles["social-icons"]} flex spaced center-align`}
              >
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
            </>
          )}
        </div>

        <div className={styles.padding}>
          <div className="flex center-align between">
            <div className="margin-right spaced">
              <p className="title margin-bottom spaced bold">
                {product.name.split("–")[0]}
              </p>
              <h1 className={` margin-bottom xl ${styles.subTitle}`}>
                {product.subtitle || product.name.split("–")[1]}
              </h1>
            </div>
            <div className="bold primary-color center">
              {product.variants.length ? <p>FROM</p> : null}
              <p className="larger">
                {getPriceDisplay(product.price, currency)}
              </p>
            </div>
          </div>
          {product.temporaryNotes && (
            <div className={styles["temporary-notes"]}>
              {product.temporaryNotes &&
                product.temporaryNotes?.length > 0 &&
                product.temporaryNotes.map((note, index) => (
                  <p
                    className={`${styles["product-info"]} center-align flex spaced`}
                    key={index}
                  >
                    <img
                      src="/icons/info.svg"
                      alt="information"
                      className="generic-icon"
                    />

                    <span key={index}>{note}</span>
                  </p>
                ))}
            </div>
          )}
          {deviceType === "mobile" && (
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
          )}

          {product.description && (
            <>
              <h3 className="title small bold">Description</h3>
              <p id="description" className={`normal-text description`}></p>
            </>
          )}
          {product.type === "variable" && (
            <div>
              <br />
              {shouldShowRegularSizes && (
                <>
                  <button
                    onClick={() => setsizeType("regular")}
                    className={`${styles["tab-title"]}`}
                  >
                    {!shouldShowVipSizes ? "Sizes" : "Regular Sizes"}
                  </button>

                  <div className={styles["size-wrapper"]}>
                    {product.variants
                      ?.filter(variant => variant.class === "regular")
                      .map((variant, index) => (
                        <span
                          key={index}
                          className={[
                            styles.size,
                            selectedSize?.name === variant.name &&
                              styles["selected-size"]
                          ].join(" ")}
                          onClick={() => {
                            setSelectedSize({
                              name: variant.name,
                              price: variant.price,
                              designOptions: variant.design
                            });
                            setProductPrice(variant.price);
                          }}
                        >
                          {variant.name.slice(1)} |{" "}
                          {getPriceDisplay(variant.price, currency)}
                        </span>
                      ))}
                  </div>
                </>
              )}
              {shouldShowVipSizes && (
                <>
                  <button
                    onClick={() => setsizeType("vip")}
                    className={`${styles["tab-title"]} ${
                      sizeType === "vip" ? styles.active : null
                    }`}
                  >
                    VIP Sizes
                  </button>

                  <div className={styles["size-wrapper"]}>
                    {product.variants
                      ?.filter(variant => variant.class === "vip")
                      .map((variant, index) => {
                        return (
                          <span
                            key={index}
                            className={[
                              styles.size,
                              selectedSize?.name === variant.name &&
                                styles["selected-size"]
                            ].join(" ")}
                            onClick={() => {
                              setSelectedSize({
                                name: variant.name,
                                price: variant.price,
                                designOptions: variant.design
                              });
                              setProductPrice(variant.price);
                            }}
                          >
                            {variant.name.slice(1).replace(/Vip/i, "VIP")} |
                            {getPriceDisplay(variant.price, currency)}
                          </span>
                        );
                      })}
                  </div>
                  <br />
                </>
              )}
              {selectedSize?.designOptions && (
                <>
                  {product.designOptions && (
                    <div className="align-icon vertical-margin tooltip">
                      <h3 className="bold margin-right">Select Design</h3>
                      <img
                        src="/icons/info.svg"
                        alt="information"
                        className="generic-icon"
                      />{" "}
                      {product.designNote && (
                        <span className="tooltiptext">
                          {product.designNote}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex spaced margin-bottom">
                    {selectedSize.designOptions.map(designOption => (
                      <div
                        key={designOption.name}
                        className={[
                          styles.design,
                          selectedDesign?.name === designOption.name &&
                            styles["selected-design"]
                        ].join(" ")}
                        onClick={() => setSelectedDesign(designOption)}
                      >
                        <img
                          src={`/icons/${designOption.name}.svg`}
                          alt="box"
                          className={`generic-icon xxl margin-bottom spaced ${designOption.name ===
                            "inLargeVase" && styles["inLargeVase"]}`}
                        />
                        <p className="vertical-margin bold">
                          {designOption.title}
                        </p>
                        {designOption.default ? (
                          <p>Default</p>
                        ) : designOption.price ? (
                          <p>
                            + {getPriceDisplay(designOption.price, currency)}
                          </p>
                        ) : (
                          <p>Complimentary</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className={styles["menu-wrapper"]}>
            {product.addonsGroups.length > 0 && (
              <h3 className="bold vertical-margin spaced">
                Awesome Gifts to Include
              </h3>
            )}
            {product.addonsGroups.map((group, index) => (
              <div key={index}>
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
                        <p>{getPriceDisplay(addon.price, currency)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            className={`flex spaced  block ${deviceType == "desktop" &&
              "vertical-margin"}`}
          >
            <Button
              disabled={cannotBuy}
              className={` spaced ${deviceType == "desktop" &&
                "vertical-margin"}`}
              responsive
              onClick={() => handleAddToCart()}
              tooltip={
                cannotBuy
                  ? `You must select a budget${
                      product.designOptions ? " and design" : ""
                    } first`
                  : ""
              }
            >
              Add to Cart {getPriceDisplay(total || productPrice, currency)}
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.padding}>
        <p className="title bold margin-top spaced">Related Products</p>
        <div className="flex between vertical-margin spaced wrap">
          {product.relatedProducts?.map((item, index) => (
            <FlowerCard
              key={index}
              name={item.name.split("–")[0]}
              image={item.images.src}
              price={item.price}
              subTitle={item.subtitle || item.name.split("–")[1]}
              url={`/product/${item.slug}`}
              buttonText="Add to Cart"
            />
          ))}
        </div>

        <>
          <button className={`title small bold`}>Product Description</button>

          {descriptionTab === "product description" && (
            <p id="long-description" className="description normal-text"></p>
          )}
        </>
      </div>
    </section>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { productSlug } = params || {};
  const { data, error, message } = await getProduct(String(productSlug), 4);
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
      paths: [],
      fallback: false
    };
  } else {
    return {
      paths: slugs,
      fallback: false // true or 'blocking'
    };
  }
};

export default ProductPage;
