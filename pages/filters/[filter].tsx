import { FunctionComponent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs, { Dayjs } from "dayjs";
import { GetStaticProps } from "next";
import {
  getProductsByCategory,
  getProduct
} from "../../utils/helpers/data/products";
import Product from "../../utils/types/Product";
import styles from "./filters.module.scss";
import Checkbox from "../../components/checkbox/Checkbox";
import FlowerCard from "../../components/flower-card/FlowerCard";
import {
  aboutUsContent,
  filtersCatgories,
  occasions,
  otherSampleProducts,
  sortOptions
} from "../../utils/constants";
import DatePicker from "../../components/date-picker/DatePicker";
import Select from "../../components/select/Select";
import { FetchResourceParams } from "../../utils/types/FetchResourceParams";

export const flowers = [
  {
    ...otherSampleProducts,
    images: [
      {
        src: "/images/sample-flowers/sample-1.png",
        id: 12,
        alt: "5 peas in a pod"
      }
    ],
    name: "5 Peas in a pod",
    price: 6000,
    details: "5 Peas in a pod"
  },
  {
    ...otherSampleProducts,
    images: [
      {
        src: "/images/sample-flowers/sample-2.png",
        id: 12,
        alt: "5 peas in a pod"
      }
    ],
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod"
  },
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    images: [
      {
        src: "/images/sample-flowers/sample-3.png",
        id: 12,
        alt: "5 peas in a pod"
      }
    ],
    price: 36000,
    details: "5 Peas in a pod"
  },
  {
    ...otherSampleProducts,
    images: [
      {
        src: "/images/sample-flowers/sample-4.png",
        id: 12,
        alt: "5 peas in a pod"
      }
    ],
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod"
  }
];

export const _gifts = [
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    price: 6000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "flower1",
        src: "/images/sampleImage/filter-page/gift-1.png",
        id: 1
      }
    ]
  },
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "flower1",
        src: "/images/sampleImage/filter-page/gift-2.png",
        id: 1
      }
    ]
  },
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "flower1",
        src: "/images/sampleImage/filter-page/gift-3.png",
        id: 1
      }
    ]
  },
  {
    ...otherSampleProducts,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "flower1",
        src: "/images/sampleImage/filter-page/gift-4.png",
        id: 1
      }
    ]
  }
];

const JustToSayTexts = ["Hi", "Thank You", "Congrats", "Etc"];

const LandingPage: FunctionComponent<{ product: Product }> = () => {
  const { query } = useRouter();
  const { filter, selectedOccasion } = query;
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[] | null>();
  const [count, setCount] = useState(1);
  const [JustToSayText, setJustToSayText] = useState(JustToSayTexts[0]);
  const [category, setCategory] = useState<string>("Anniversary Flowers");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState(false);

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

  const [todayDate, setTodayDate] = useState<Dayjs | null>(dayjs());
  const [filterCategories, setFilterCategories] = useState(filtersCatgories);
  const [sort, setSort] = useState<string>("");

  const handleChange = (name: string, category: string) => {
    setSelectedFilter(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
    setSelectedFilterCategory(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleClearFIlter = () => {
    setSelectedFilter([]);
    setSelectedFilterCategory([]);
  };

  const fetchProductCategory = async () => {
    setLoading(true);
    const filterParams = {
      category: selectedFilterCategory.length
        ? selectedFilterCategory.join(",")
        : category
    };
    const params: FetchResourceParams = {
      pageNumber: 1,
      filter: filterParams
    };
    const response = await getProductsByCategory(params);
    if (response.error) {
      console.log(response.error);
    } else {
      setProducts(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProductCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, selectedFilterCategory]);

  return (
    <section className={styles.filters}>
      <div className={[styles["hero-bg"]].join(" ")}>
        <div className="hero-content flex column center center-align">
          {filter === "occasions" && (
            <div className={styles["occasion-wrapper"]}>
              {occasions.map(occasion => (
                <Link href={occasion.url} key={occasion.title}>
                  <a
                    className={[
                      styles["occasion"],
                      selectedOccasion === occasion.url.split("=")[1] &&
                        styles["selected-occasion"]
                    ].join(" ")}
                    onClick={() => {
                      setCategory(occasion?.category || "");
                    }}
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
      </div>
      <div className={`${styles["content"]} flex spaced-xl`}>
        <div className={styles["left-side"]}>
          <div className="vertical-margin spaced">
            <span className={`bold margin-right ${styles["sub-title"]}`}>
              Filters ({selectedFilter.length})
            </span>
            <button className="primary-color" onClick={handleClearFIlter}>
              Clear Filters
            </button>
          </div>

          <div className={styles["filters-sidebar"]}>
            {filterCategories.map((filter, index) => (
              <div key={index} className="vertical-margin spaced">
                <p className="bold vertical-margin spaced">{filter.name}</p>
                <div>
                  {(filter.viewMore
                    ? filter.options
                    : filter.options.slice(0, filter.limit)
                  ).map((child, index) => (
                    <div key={index} className="margin-bottom">
                      <Checkbox
                        onChange={() =>
                          handleChange(child.name, child.category || "")
                        }
                        text={child.name}
                        checked={selectedFilter.includes(child.name)}
                      />
                    </div>
                  ))}
                </div>
                {filter.limit < filter.options.length && (
                  <button
                    className={styles["btn-view"]}
                    onClick={() => {
                      setFilterCategories(prev =>
                        prev.map((item, _index) => {
                          if (index === _index) {
                            return {
                              ...item,
                              viewMore: !item.viewMore
                            };
                          }
                          return item;
                        })
                      );
                    }}
                  >
                    {!filter.viewMore ? "View More" : "View Less"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-one">
          <div className="flex between">
            <div>
              Delivery Date:{" "}
              <DatePicker
                onChange={date => {
                  setTodayDate(date);
                }}
                value={todayDate}
                format="D MMM YYYY"
              />
            </div>

            <div className="flex center-align spaced">
              <span>Sort:</span>
              <Select
                options={sortOptions}
                value={sort}
                onSelect={value => setSort(value as string)}
                placeholder="Default"
              />
            </div>
          </div>
          {loading ? (
            <h1>Loading</h1>
          ) : (
            <div>
              <p className={`${styles.title} bold vertical-margin spaced`}>
                {
                  occasions.filter(occasion => {
                    return selectedOccasion === occasion.url.split("=")[1];
                  })[0]?.title
                }{" "}
                Flowers
              </p>

              <div
                className={`${styles.products} flex vertical-margin wrap between`}
              >
                {products?.map((product, index) => (
                  <FlowerCard
                    key={index}
                    name={product.name}
                    image={product.images[0].src}
                    price={product.price}
                    buttonText="Add to Cart"
                    subTitle={product.details}
                    url={`/products/${product.slug}`}
                    mode="three-x-grid"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.gifts}>
        <div className="flex between margin-bottom spaced">
          <span className={styles.title}>Gifts to Include with Flowers</span>
          <button
            className={`primary-color flex center-align spaced ${styles["sub-title"]}`}
          >
            <span>See All</span>{" "}
            <img
              className="generic-icon"
              src="/icons/arrow-right.svg"
              alt="arrow right"
            />
          </button>
        </div>
        <div className="flex between vertical-margin spaced wrap">
          {_gifts.map((flower, index) => (
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
        <div className={styles.stories}>
          <h1 className={`text-center ${styles.title}`}>
            Flower Delivery for all Occasions
          </h1>
          <div className="flex between spaced-xl">
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
          filter: "occasions"
        }
      }
    ],
    fallback: false // true or 'blocking'
  };
};

export default LandingPage;
