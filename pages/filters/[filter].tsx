import { FunctionComponent, useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { getProduct } from "../../utils/helpers/data/products";
import Product from "../../utils/types/Product";
import styles from "./filters.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import Checkbox from "../../components/checkbox/Checkbox";
import FlowerCard from "../../components/flower-card/FlowerCard";
import { aboutUsContent } from "../../utils/constants";

export const otherSampleProducts = {
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
  slug: "belleza-regal-two-colors-rose-red-yellow-white-pink-orange",
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
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors."
} as Product;

export const flowers: Product[] = [
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    price: 6000,
    details: "5 Peas in a pod"
  },
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod"
  },
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod"
  },
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod"
  }
];

const JustToSayTexts = ["Hi", "Thank You", "Congrats", "Etc"];

const LandingPage: FunctionComponent<{ product: Product }> = () => {
  const { query } = useRouter();
  const { filter, selectedOccassion } = query;
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [products] = useState<Product[]>(flowers);
  const [count, setCount] = useState(1);
  const [JustToSayText, setJustToSayText] = useState(JustToSayTexts[0]);

  const shuffleText = () => {
    if (count < JustToSayTexts.length - 1) {
      setJustToSayText(JustToSayTexts[count]);
      setCount(count + 1);
    } else {
      setCount(0);
      setJustToSayText(JustToSayTexts[count]);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(shuffleText, 3000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const occassions: { title: string; url: string }[] = [
    {
      title: "Love, Birthdays & Anniversary",
      url: "/filters/occassions?selectedOccassion=love-birthdays-anniversary"
    },
    {
      title: "Just to Say",
      url: "/filters/occassions?selectedOccassion=just-to-say"
    },
    {
      title: "Bridal Bouquets",
      url: "/filters/occassions?selectedOccassion=bridal-bouquets"
    },
    {
      title: "Funeral & Condolence",
      url: "/filters/occassions?selectedOccassion=funeral-condolence"
    },
    {
      title: "All Occasions",
      url: "/filters/occassions?selectedOccassion=all-occasions"
    }
  ];

  const filtersCatgories: { name: string; options: { name: string }[] }[] = [
    {
      name: "Occasions",
      options: [
        {
          name: "Love, Birthdays & Anniversary"
        },
        {
          name: "Just to say Hi, Sorry, Thank You."
        },
        {
          name: "Get well soon"
        },
        {
          name: "Bridal"
        },
        {
          name: "Burial & Condolences"
        }
      ]
    },
    {
      name: "Budget",
      options: [
        {
          name: "Regular"
        },
        {
          name: "VIP"
        }
      ]
    },
    {
      name: "Packages",
      options: [
        {
          name: "Bundled Products"
        }
      ]
    },
    {
      name: "Delivery",
      options: [
        {
          name: "Same Day Delivery"
        }
      ]
    },
    {
      name: "Flower Name",
      options: [
        {
          name: "Roses"
        },
        {
          name: "Chrysanthemums"
        },
        {
          name: "Lilies"
        },
        {
          name: "Million Stars"
        }
      ]
    }
  ];

  const handleChange = (name: string) => {
    setSelectedFilter(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  const handleClearFIlter = () => {
    setSelectedFilter([]);
  };

  return (
    <section className={styles.filters}>
      <div className={styles["hero"]}>
        {filter === "occassions" && (
          <div className={styles["occassion-wrapper"]}>
            {occassions.map(occasion => (
              <Link href={occasion.url} key={occasion.title}>
                <a
                  className={[
                    styles["occassion"],
                    selectedOccassion === occasion.url.split("=")[1] &&
                      styles["selected-occassion"]
                  ].join(" ")}
                >
                  <strong>
                    {occasion.title}
                    <br />
                    {occasion.title === "Just to Say" && (
                      <span>{JustToSayText}</span>
                    )}{" "}
                  </strong>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className={`${styles["content"]} flex spaced-xl`}>
        <div className={styles["left-side"]}>
          <div className="vertical-margin spaced">
            <span className="title small bold margin-right">Filters (4)</span>
            <button className="primary-color" onClick={handleClearFIlter}>
              Clear Filters
            </button>
          </div>

          <div className={styles["filters"]}>
            {filtersCatgories.map((filter, index) => (
              <div key={index} className="vertical-margin spaced">
                <p className="bold vertical-margin spaced">{filter.name}</p>
                <div>
                  {filter.options.map((child, index) => (
                    <div key={index} className="margin-bottom">
                      <Checkbox
                        onChange={() => handleChange(child.name)}
                        text={child.name}
                        checked={selectedFilter.includes(child.name)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-one">
          <div className="flex between">
            <p>
              Delivery Date:{" "}
              <span className={styles.date}>
                18/12/2021 <img src="/icons/calender.svg" alt="calender" />{" "}
              </span>
            </p>
            <p>
              Sort:{" "}
              <span className={[styles.date, styles.sort].join(" ")}>
                Default
                <svg
                  className={styles.arrow}
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
              </span>
            </p>
          </div>
          <div>
            <p className="title bold vertical-margin spaced">
              {
                occassions.filter(occassion => {
                  return selectedOccassion === occassion.url.split("=")[1];
                })[0]?.title
              }{" "}
              Flowers
            </p>

            <div
              className={`${styles.products} flex between vertical-margin wrap`}
            >
              {products.map((product, index) => (
                <FlowerCard
                  key={index}
                  name={product.name}
                  image={product.images[0].src}
                  price={product.price}
                  buttonText="Add to Cart"
                  subTitle={product.details}
                  url={`/products/${product.slug}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gifts}>
        <div className="flex between margin-bottom spaced">
          <span className="title bold">Gifts to Include with Flowers</span>
          <button className="primary-color bold flex center-align spaced">
            <span>See All</span>{" "}
            <img
              className="generic-icon"
              src="/icons/arrow-right.svg"
              alt="arrow right"
            />
          </button>
        </div>
        <div className="flex between vertical-margin spaced wrap">
          {flowers.map((flower, index) => (
            <FlowerCard
              key={index}
              name={flower.name}
              image={flower.images[0].src}
              subTitle={"Cakes and cupcakes are a great choice"}
              buttonText="See More"
              url={`/products/${flower.slug}`}
              price={flower.price}
            />
          ))}
        </div>
        <p className="title bold center">Flower Delivery for all Occassions</p>
      </div>
      <div className="flex between spaced-xl horizontal-padding xl">
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
          filter: "occassions"
        }
      }
    ],
    fallback: false // true or 'blocking'
  };
};

export default LandingPage;
