import { FunctionComponent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs, { Dayjs } from "dayjs";
import { getProductsByCategory } from "../../utils/helpers/data/products";
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
import useScrollHandler from "../../utils/hooks/useScrollHandler";
import useDeviceType from "../../utils/hooks/useDeviceType";
import Button from "../../components/button/Button";
import useOutsideClick from "../../utils/hooks/useOutsideClick";

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

const Index: FunctionComponent<{ product: Product }> = () => {
  const { query } = useRouter();
  const { selectedOccasion } = query;
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(1);
  const [JustToSayText, setJustToSayText] = useState(JustToSayTexts[0]);
  const [category, setCategory] = useState<string>();
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<
    string[]
  >([]);
  const [selectedTagCategories, setSelectedTagCategories] = useState<string[]>(
    []
  );
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [productsLoading, setproductsLoading] = useState(false);
  const [todayDate, setTodayDate] = useState<Dayjs | null>(dayjs());
  const [filterCategories, setFilterCategories] = useState(filtersCatgories);
  const [sort, setSort] = useState<string>("");
  const [hasMore, setHasMore] = useState(false);
  const [shouldShowFilter, setShouldShowFilter] = useState(false);

  const filterDropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setShouldShowFilter(false);
  });

  const deviceType = useDeviceType();

  const rootRef = useRef<HTMLDivElement>(null);
  const [
    lastProductEleRef,
    setLastProductEleRef
  ] = useState<HTMLAnchorElement | null>(null);

  const [page] = useScrollHandler({
    node: lastProductEleRef
  });

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

  const handleFilterCategoryChange = (name: string, category: string) => {
    setSelectedFilter(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
    setSelectedFilterCategory(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleTagCategoryChange = (name: string, tag?: string) => {
    setSelectedFilter(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
    tag &&
      setSelectedTagCategories(prev =>
        prev.includes(tag) ? prev.filter(item => item !== tag) : [...prev, tag]
      );
  };

  const handleClearFIlter = () => {
    setSelectedFilter([]);
    setSelectedFilterCategory([]);
  };

  const fetchProductCategory = async () => {
    products.length === 0 ? setproductsLoading(true) : setInfiniteLoading(true);
    const filterParams = {
      category: selectedFilterCategory.length
        ? selectedFilterCategory.join(",")
        : category || (selectedOccasion as string),
      tags: selectedTagCategories.length ? selectedTagCategories.join(" ,") : ""
    };
    const params: FetchResourceParams = {
      pageNumber: page,
      filter: filterParams
    };
    const response = await getProductsByCategory(params);
    if (response.error) {
      console.log(response.error);
    } else {
      setHasMore((response.data as Product[]).length > 0);
      setProducts((prev: any) => [...prev, ...(response.data as Product[])]);
    }
    products.length === 0
      ? setproductsLoading(false)
      : setInfiniteLoading(false);
  };

  useEffect(() => {
    setProducts([]);
  }, [selectedFilterCategory, category, selectedTagCategories]);

  useEffect(() => {
    fetchProductCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    category,
    selectedFilterCategory,
    page,
    selectedTagCategories,
    selectedOccasion
  ]);

  return (
    <section className={styles.filters} ref={rootRef}>
      <div className={[styles["hero-bg"]].join(" ")}>
        <div className={`hero-content flex column center center-align `}>
          <div className={styles["occasion-wrapper"]}>
            {occasions.map(occasion => (
              <Link href={occasion.url} key={occasion.title}>
                <a
                  className={[
                    styles["occasion"],
                    selectedOccasion === occasion.url.split("=")[1] &&
                      styles["active"]
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
          {/* )} */}
        </div>
      </div>
      <div
        className={`${styles["content"]} flex ${deviceType === "desktop" &&
          "spaced-xl"}`}
      >
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
                        onChange={() => {
                          child.category
                            ? handleFilterCategoryChange(
                                child.name,
                                child.category || ""
                              )
                            : handleTagCategoryChange(child.name, child.tag);
                        }}
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
        <div className={styles["product-wrapper"]}>
          <div className="flex between">
            <div className={styles["date-wrapper"]}>
              <div>
                <span>Delivery Date: </span>
                <DatePicker
                  onChange={date => {
                    setTodayDate(date);
                  }}
                  value={todayDate}
                  format="D MMM YYYY"
                />
              </div>

              <div>
                <span>Sort: </span>
                <Select
                  options={sortOptions}
                  value={sort}
                  onSelect={value => setSort(value as string)}
                  placeholder="Default"
                />
              </div>
            </div>

            <div className={styles["filter-mobile"]} ref={filterDropdownRef}>
              <button
                className={styles.btn}
                onClick={() => setShouldShowFilter(!shouldShowFilter)}
              >
                <h3 className="margin-right">
                  Filter({selectedFilter.length})
                </h3>
                <img
                  alt="filter"
                  className="generic-icon medium"
                  src="/icons/filter.svg"
                />
              </button>
              <div
                className={[
                  styles["filters-dropdown"],
                  shouldShowFilter && styles.active
                ].join(" ")}
              >
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
                            onChange={() => {
                              child.category
                                ? handleFilterCategoryChange(
                                    child.name,
                                    child.category || ""
                                  )
                                : handleTagCategoryChange(
                                    child.name,
                                    child.tag
                                  );
                            }}
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
          </div>

          <div>
            <p className={`${styles.title} bold vertical-margin spaced`}>
              {occasions.filter(occasion => {
                return selectedOccasion === occasion.url.split("=")[1];
              })[0]?.title || selectedOccasion}{" "}
              Flowers
            </p>

            <div className={`${styles.products}`}>
              {productsLoading && (
                <img
                  src="/images/spinner.svg"
                  alt="spinner"
                  className="generic-icon xxl spinner"
                />
              )}
              {products?.map((product, index, arr) => (
                <FlowerCard
                  key={index}
                  name={product.name}
                  image={product.images[0].src}
                  price={product.price}
                  buttonText="Add to Cart"
                  subTitle={product.details}
                  url={`/products/${product.slug}`}
                  // mode="three-x-grid"
                  mode={`${
                    deviceType === "desktop" ? "three-x-grid" : "two-x-grid"
                  }`}
                  ref={
                    index === arr.length - 1
                      ? ele => {
                          if (ele && hasMore) {
                            setLastProductEleRef(ele);
                          }
                        }
                      : null
                  }
                  product={product}
                  cart
                />
              ))}
            </div>
          </div>
          {infiniteLoading && hasMore && (
            <img
              src="/images/spinner.svg"
              alt="spinner"
              className="generic-icon xl spinner"
            />
          )}
        </div>
      </div>
      <div className={styles.gifts}>
        <div className="flex between margin-bottom spaced">
          <span className={styles.title}>Gifts to Include with Flowers</span>
          {deviceType === "desktop" && (
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
          )}
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
        {deviceType === "mobile" && (
          <Button
            url="/filters?selectedOccasion=all-occasions"
            type="accent"
            minWidth
            className={styles["see-all"]}
          >
            <h3 className="red margin-right">See All</h3>
          </Button>
        )}
        <div className={styles.stories}>
          <h1 className={`text-center ${styles.title}`}>
            Flower Delivery for all Occasions
          </h1>
          <div
            className={`flex between ${deviceType === "desktop" &&
              " spaced-xl"} ${deviceType === "mobile" && "column"}`}
          >
            <div
              className={`${deviceType === "mobile" ? "block" : "half-width"}`}
            >
              <p className="title small bold margin-bottom">
                {aboutUsContent.howItBegan.title}
              </p>
              <p>{aboutUsContent.howItBegan.content}</p>
              <p className="title small bold vertical-margin">
                {aboutUsContent.openingHour.title}
              </p>
              <p>{aboutUsContent.openingHour.content}</p>
            </div>
            <div
              className={`${deviceType === "mobile" ? "block" : "half-width"}`}
            >
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

export default Index;
