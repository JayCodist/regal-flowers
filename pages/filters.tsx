import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getProductsByCategory } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";
import Checkbox from "../components/checkbox/Checkbox";
import FlowerCard from "../components/flower-card/FlowerCard";
import {
  FilterOption,
  aboutUsContent,
  breadcrumbItems,
  bridalOccasionFilters,
  defaultBreadcrumb,
  filtersCatgories,
  funeralOccasion,
  giftItems,
  gifts,
  occasions,
  otherOccasions,
  sortOptions,
  tagsMap
} from "../utils/constants";
import Select from "../components/select/Select";
import {
  FetchResourceParams,
  SortLogic
} from "../utils/types/FetchResourceParams";
import useScrollHandler from "../utils/hooks/useScrollHandler";
import useDeviceType from "../utils/hooks/useDeviceType";
import Button from "../components/button/Button";
import useOutsideClick from "../utils/hooks/useOutsideClick";
import styles from "./filters.module.scss";
import SettingsContext from "../utils/context/SettingsContext";
import Radio from "../components/radio/Radio";

const giftMap: Record<string, string> = {
  "gift-items-perfumes-cakes-chocolate-wine-giftsets-and-teddy-bears":
    "gift-items-perfumes-cakes-chocolate-wine-giftsets-and-teddy-bears",
  "chocolate-and-biscuits": "chocolate-and-biscuits",
  "cakes-and-cupcakes": "cakes-and-cupcakes",
  "teddy-bears": "teddy-bears",
  "wine-and-champagne": "wine-and-champagne",
  "gift-packs": "gift-packs",
  perfumes: "perfumes",
  balloons: "balloons"
};

type ProductClass = "vip" | "regular";

export interface ProductFilterLogic {
  category: string[];
  productClass?: ProductClass;
  budget?: string[];
  design?: string[];
  flowerType?: string[];
  flowerName?: string[];
  packages?: string[];
  delivery?: string[];
}

const JustToSayTexts = ["Sorry", "Hi", "Thank You", "Congrats", "Etc"];

type ProductCategory = "vip" | "occasion";

type Sort = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const ProductsPage: FunctionComponent<{
  productCategory: ProductCategory;
  categorySlug?: string;
  productClass?: ProductClass;
}> = props => {
  const { productCategory = "occasion", categorySlug, productClass } = props;

  const bridalCategories = [
    "cascadingdropping-bouquets",
    "accessories-boutonnieres-bridesmaids-flowers-amp-corsages",
    "bridal-bouquets"
  ];

  const funeralCategories = ["funeral-amp-condolence"];

  const _filterCategories =
    categorySlug === "all"
      ? []
      : bridalCategories.includes(categorySlug as string)
      ? bridalOccasionFilters
      : funeralCategories.includes(categorySlug as string)
      ? funeralOccasion
      : filtersCatgories;

  const router = useRouter();
  const { query, isReady } = router;
  const { selectedOccasion, shopBy } = query;
  const [selectedFilter, setSelectedFilter] = useState<string[]>(["regular"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(1);
  const [JustToSayText, setJustToSayText] = useState(JustToSayTexts[0]);
  const [pageTitle, setPageTitle] = useState("");

  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [filterCategories, setFilterCategories] = useState(_filterCategories);
  const [sort, setSort] = useState<Sort>("name-asc");
  const [hasMore, setHasMore] = useState(false);
  const [shouldShowFilter, setShouldShowFilter] = useState(false);

  const filterDropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setShouldShowFilter(false);
  });

  const isGiftPage = giftMap[categorySlug as string];

  const { notify, setRedirectUrl, setBreadcrumb } = useContext(SettingsContext);

  const deviceType = useDeviceType();

  const selectedBreadcrumb = breadcrumbItems.find(_breadcrumb =>
    categorySlug
      ? _breadcrumb.url === categorySlug
      : _breadcrumb.url === productCategory
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const [
    lastProductEleRef,
    setLastProductEleRef
  ] = useState<HTMLAnchorElement | null>(null);

  const [page, setPage] = useScrollHandler({
    node: lastProductEleRef
  });
  const hideFilterInfo = [
    ...bridalCategories,
    ...funeralCategories,
    "all"
  ].includes(categorySlug as string);

  const shuffleText = () => {
    if (count < JustToSayTexts.length - 1) {
      setJustToSayText(JustToSayTexts[count]);
      setCount(count + 1);
    } else {
      setCount(0);
      setJustToSayText(JustToSayTexts[count]);
    }
  };

  const handleClearFIlter = () => {
    setSelectedFilter([]);
    router.push(`/product-category/${categorySlug}`, undefined, {
      scroll: false
    });
  };

  const fetchProductCategory = async (shouldAppend?: boolean) => {
    if (shouldAppend) {
      setInfiniteLoading(true);
    } else {
      setProductsLoading(true);
    }

    const shopByArray = String(shopBy).split(",");

    const tagFilters: Record<string, string[]> = shopBy
      ? shopByArray.reduce((map: Record<string, string[]>, tag) => {
          const tagKey = Object.keys(tagsMap).find(key => {
            return tagsMap[key].includes(tag);
          });
          if (tagKey) {
            map[tagKey] = [...(map[tagKey] || []), tag];
          }
          return map;
        }, {})
      : isGiftPage || hideFilterInfo
      ? {}
      : {
          budget: productClass == "vip" ? ["vip"] : ["regular"]
        };

    const filterParams = {
      category: [
        !["vip", "all"].includes(categorySlug || "") ? categorySlug || "" : ""
      ],
      productClass,
      ...tagFilters
    };

    const sortParams: SortLogic = {
      sortField: sort.split("-")[0],
      sortType: sort.split("-")[1] as "asc" | "desc"
    };
    const params: FetchResourceParams<ProductFilterLogic> = {
      pageNumber: page,
      filter: filterParams,
      sortLogic: sortParams
    };

    const response = await getProductsByCategory(params);
    setProductsLoading(false);
    setInfiniteLoading(false);
    if (response.error) {
      notify("error", `Unable to fetch product category: ${response.message}`);
    } else {
      setHasMore((response.data as Product[]).length > 0);

      setProducts(
        shouldAppend
          ? [...products, ...(response.data as Product[])]
          : (response.data as Product[])
      );
    }
  };

  const handleFilterChange = (filter: FilterOption) => {
    const newFilters = selectedFilter.includes(filter.tag || "")
      ? selectedFilter.filter(_filter => _filter !== filter.tag)
      : [...selectedFilter, filter.tag];
    setSelectedFilter(newFilters.filter(Boolean) as string[]);
    setProductsLoading(true);

    const url = categorySlug
      ? `/product-category/${categorySlug}?shopBy=${newFilters.join(",")}`
      : `/filters?shopBy=${newFilters.join(",")}`;
    router.push(url, undefined, { scroll: false });
  };

  useEffect(() => {
    if (isReady) {
      if (shopBy === "vip" || productClass === "vip") {
        setSelectedFilter(["vip"]);
      } else {
        if (categorySlug === "vip") {
          setSelectedFilter(["vip"]);
          return;
        }
        const filters = shopBy
          ? String(shopBy || "")
              .split(",")
              .filter(Boolean)
          : ["regular"];

        setSelectedFilter([...filters]);
        shopBy && setShouldShowFilter(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopBy]);

  useEffect(() => {
    if (productClass === "vip") {
      setSelectedFilter(["vip"]);
    }
  }, [productClass]);

  useEffect(() => {
    const intervalId = setInterval(shuffleText, 3000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (isReady) {
      if (page === 1) {
        fetchProductCategory();
      } else {
        fetchProductCategory(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (productCategory === "vip") {
      const filteredCategory = filterCategories.filter(
        item => item.name.toLowerCase() !== "budget"
      );
      setFilterCategories(filteredCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOccasion]);

  useEffect(() => {
    if (isReady) {
      setPage(1);
      fetchProductCategory();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, selectedOccasion, sort]);

  useEffect(() => {
    if (isReady) {
      const occasionTitle = occasions.find(
        item => item.url === `/product-category/${categorySlug}`
      )?.title;
      const giftTitle = gifts.find(
        item => item.url === `/product-category/${categorySlug}`
      )?.title;
      const otherTitle = otherOccasions.find(
        item => item.url === `/product-category/${categorySlug}`
      )?.title;
      const title = occasionTitle || giftTitle || otherTitle;

      if (title) {
        setPageTitle(title);
      }

      setFilterCategories(_filterCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, isReady]);

  useEffect(() => {
    if (isReady) {
      setRedirectUrl(router.asPath);
      setBreadcrumb(
        selectedBreadcrumb
          ? {
              label: selectedBreadcrumb.label,
              url: router.asPath
            }
          : defaultBreadcrumb
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return (
    <section className={styles.filters} ref={rootRef}>
      <div
        className={[
          styles["hero-bg"],
          productCategory === "occasion" && styles["occasion-bg"],
          productCategory === "vip" && styles["vip-bg"]
        ].join(" ")}
      >
        <div className={`hero-content flex column center center-align `}>
          {productCategory === "occasion" && deviceType === "desktop" && (
            <div
              className={[
                styles["occasion-wrapper"],
                isGiftPage && styles["gifts-wrapper"]
              ].join(" ")}
            >
              {(isGiftPage ? gifts : occasions).map((occasion, index) => {
                return (
                  <Link href={occasion.url} key={index}>
                    <a
                      className={[
                        styles["occasion"],
                        isGiftPage && styles["gift-occasion"],

                        categorySlug === occasion.url.split("/")[2] &&
                          styles["active"]
                      ].join(" ")}
                      onClick={() => {
                        router.push(occasion.url, undefined, {
                          scroll: false
                        });
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
                );
              })}
            </div>
          )}
          {productCategory === "occasion" && deviceType === "mobile" && (
            <div className={styles["occasions-mobile"]}>
              <div
                className={`margin-bottom spaced ${styles.occasions} ${giftMap[
                  categorySlug || ""
                ] && styles["gifts-category"]}`}
              >
                {(isGiftPage ? gifts : occasions)
                  .slice(0, isGiftPage ? 4 : 3)
                  .map((occasion, index) => {
                    return (
                      <Link href={occasion.url} key={index}>
                        <a
                          className={[
                            styles["occasion"],
                            isGiftPage && styles["gift-occasion"],

                            categorySlug === occasion.url.split("/")[2] &&
                              styles["active"]
                          ].join(" ")}
                          onClick={() => {
                            router.push(occasion.url, undefined, {
                              scroll: false
                            });
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
                    );
                  })}
              </div>
              <div
                className={[
                  styles.occasions,
                  isGiftPage && styles["gifts-categor"]
                ].join(" ")}
              >
                {(isGiftPage ? gifts : occasions)
                  .slice(isGiftPage ? 4 : 3)
                  .map((occasion, index) => {
                    return (
                      <Link href={occasion.url} key={index}>
                        <a
                          className={[
                            styles["occasion"],
                            isGiftPage && styles["gift-occasion"],

                            categorySlug === occasion.url.split("/")[2] &&
                              styles["active"]
                          ].join(" ")}
                          onClick={() => {
                            router.push(occasion.url, undefined, {
                              scroll: false
                            });
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
                    );
                  })}
              </div>
            </div>
          )}
          {productCategory === "vip" && (
            <div className={styles["vip-wrapper"]}>
              <strong className={styles["wow"]}>Wow Them</strong>
              <h1 className="primary-color">
                Go All-Out With VIP Flower Arrangements
              </h1>
              <p className={styles["info"]}>
                All VIP Orders Come With a Complimentary Gift
              </p>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles["content"]} flex ${deviceType === "desktop" &&
          "spaced-xl"}`}
      >
        {!isGiftPage && (
          <div className={styles["left-side"]}>
            {!hideFilterInfo && (
              <div className="vertical-margin spaced">
                <span className={`bold margin-right ${styles["sub-title"]}`}>
                  Filters ({selectedFilter.length})
                </span>
                <button className="primary-color" onClick={handleClearFIlter}>
                  Clear Filters
                </button>
              </div>
            )}

            <div className={styles["filters-sidebar"]}>
              {filterCategories.map((filter, index) => (
                <div key={index} className="vertical-margin spaced">
                  <p className="bold vertical-margin spaced">{filter.name}</p>
                  <div>
                    {(filter.viewMore
                      ? filter.options
                      : filter.options.slice(0, filter.limit)
                    ).map((child, i) => (
                      <div key={i} className="margin-bottom">
                        {filter.name === "Budget" ? (
                          <>
                            <div className="margin-bottom">
                              <Radio
                                label="Regular"
                                onChange={() => {
                                  const newFilters = [
                                    ...selectedFilter.filter(filter => {
                                      return filter !== "vip";
                                    }),
                                    "regular"
                                  ];
                                  setSelectedFilter(newFilters);
                                  const url = categorySlug
                                    ? `/product-category/${categorySlug}?shopBy=${newFilters.join(
                                        ","
                                      )}`
                                    : `/filters?shopBy=${newFilters.join(",")}`;
                                  router.push(url, undefined, {
                                    scroll: false
                                  });
                                }}
                                checked={selectedFilter.includes("regular")}
                              />
                            </div>

                            <Radio
                              label="VIP"
                              onChange={() => {
                                const newFilters = [
                                  ...selectedFilter.filter(filter => {
                                    return filter !== "regular";
                                  }),
                                  "vip"
                                ];
                                setSelectedFilter(newFilters);
                                const url = `/filters?shopBy=${newFilters.join(
                                  ","
                                )}`;
                                router.push(url, undefined, { scroll: false });
                              }}
                              checked={selectedFilter.includes("vip")}
                            />
                          </>
                        ) : child.link ? (
                          <Link href={child.link}>
                            <a
                              className={[
                                styles["filter-link"],
                                child.link.includes(categorySlug as string)
                                  ? styles.active
                                  : ""
                              ].join(" ")}
                            >
                              {child.name}
                            </a>
                          </Link>
                        ) : (
                          <Checkbox
                            onChange={() => handleFilterChange(child)}
                            text={child.name}
                            checked={selectedFilter.includes(child.tag || "")}
                          />
                        )}
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
        )}
        <div className={styles["product-wrapper"]}>
          <div className="flex between block center-align">
            <div className={styles["filter-mobile"]} ref={filterDropdownRef}>
              <span>Filters: </span>
              <button
                className={styles.btn}
                onClick={() => setShouldShowFilter(!shouldShowFilter)}
              >
                <h3 className="margin-right">
                  Filter{!hideFilterInfo && `(${selectedFilter.length})`}
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
                          {filter.name === "Budget" ? (
                            <>
                              <div className="margin-bottom">
                                <Radio
                                  label="Regular"
                                  onChange={() => {
                                    const newFilters = [
                                      ...selectedFilter.filter(filter => {
                                        return filter !== "vip";
                                      }),
                                      "regular"
                                    ];
                                    setSelectedFilter(newFilters);
                                    const url = categorySlug
                                      ? `/product-category/${categorySlug}?shopBy=${newFilters.join(
                                          ","
                                        )}`
                                      : `/filters?shopBy=${newFilters.join(
                                          ","
                                        )}`;
                                    router.push(url, undefined, {
                                      scroll: false
                                    });
                                  }}
                                  checked={selectedFilter.includes("regular")}
                                />
                              </div>

                              <Radio
                                label="VIP"
                                onChange={() => {
                                  const newFilters = [
                                    ...selectedFilter.filter(filter => {
                                      return filter !== "regular";
                                    }),
                                    "vip"
                                  ];
                                  setSelectedFilter(newFilters);
                                  const url = `/filters?shopBy=${newFilters.join(
                                    ","
                                  )}`;
                                  router.push(url, undefined, {
                                    scroll: false
                                  });
                                }}
                                checked={selectedFilter.includes("vip")}
                              />
                            </>
                          ) : child.link ? (
                            <Link href={child.link}>
                              <a className={styles["filter-link"]}>
                                {child.name}
                              </a>
                            </Link>
                          ) : (
                            <Checkbox
                              onChange={() => handleFilterChange(child)}
                              text={child.name}
                              checked={selectedFilter.includes(child.tag || "")}
                            />
                          )}
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
            <div className="flex column">
              <span>Sort: </span>
              <Select
                options={sortOptions}
                value={sort}
                onSelect={value => setSort(value as Sort)}
                placeholder="Default"
                className={styles["sort"]}
              />
            </div>
          </div>

          <div>
            <h1 className={`${styles.title} bold vertical-margin spaced`}>
              {productCategory === "vip"
                ? "VIP Flower Arrangements"
                : ` ${pageTitle} ${!isGiftPage && pageTitle ? "Flowers" : ""} ${
                    !isGiftPage && !pageTitle ? "All Occasion Flowers" : ""
                  }`}
            </h1>

            <div className={[styles.products].join(" ")}>
              {productsLoading && (
                <div className={styles.spinner}>
                  <img src="/images/spinner.svg" alt="spinner" />
                </div>
              )}
              {products?.map((product, index, arr) => (
                <FlowerCard
                  key={index}
                  name={product.name.split("–")[0]}
                  image={product.images[0].src}
                  price={product.price}
                  buttonText="Add to Cart"
                  subTitle={product.subtitle || product.name.split("–")[1]}
                  url={`/product/${product.slug}`}
                  mode={`${
                    deviceType === "desktop"
                      ? isGiftPage || categorySlug === "all"
                        ? "four-x-grid"
                        : "three-x-grid"
                      : "two-x-grid"
                  }`}
                  ref={
                    index === arr.length - 1
                      ? ele => {
                          if (ele && hasMore && !productsLoading) {
                            setLastProductEleRef(ele);
                          }
                        }
                      : null
                  }
                  product={product}
                  cart={product.variants?.length ? false : true}
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
        {!isGiftPage && (
          <>
            <div className="flex between margin-bottom spaced">
              <span className={styles.title}>
                Gifts to Include with Flowers
              </span>
              {deviceType === "desktop" && (
                <Button
                  url="/product-category/gift-packs"
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
              {giftItems.map((gift, index) => (
                <FlowerCard
                  key={index}
                  name={gift.name}
                  image={gift.image}
                  subTitle={gift.description}
                  buttonText="See More"
                  url={gift.slug}
                />
              ))}
            </div>
            {deviceType === "mobile" && (
              <Button
                url="/product-category/gift-packs"
                type="accent"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}{" "}
          </>
        )}
        <div className={styles.stories}>
          <h1 className={`text-center ${styles.title}`}>
            Flower Delivery for all Occasions
          </h1>

          <div className={[styles["about-section"]].join(" ")}>
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
                <Link href="/products/classic-red-roses-luxurious-bouquet-of-red-roses">
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
              <p className="title small bold vertical-margin">
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
              <p className="title small bold margin-bottom">
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
              <p className="title small bold vertical-margin">
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
                in Auja, including in Wuse 2, Maitama, Central Area, Garki,
                Jabi, Asokoro, Gwarinpa, Jahi, Lokogoma, Apo, Life Camp, Lugbe,
                Dawaki, Abuja Municipal Area Council etcetera.
                <br /> <br />
                In essence, we deliver EVERYWHERE in Lagos and Abuja
              </p>
              <p className="title small bold vertical-margin">
                {aboutUsContent.budget.title}
              </p>
              <p className="normal-text">
                We stock flowers for various occasions such as{" "}
                <Link href="/product-category/just-to-say-bouquets">
                  <a className={styles.red}> Birthday Flowers</a>
                </Link>
                ,
                <Link href="/product-category/just-to-say-bouquets">
                  <a className={styles.red}> Romantic Flowers</a>
                </Link>
                ,{" "}
                <Link href="/product-category/anniversary-flowers">
                  <a className={styles.red}> Anniversary Flowers</a>
                </Link>
                , Mothers’ Day Flowers, Get Well Soon Flowers,{" "}
                <Link href="/product-category/funeral-amp-condolence">
                  <a className={styles.red}> Funeral Wreaths</a>
                </Link>{" "}
                ,{" "}
                <Link href="/product-category/funeral-amp-condolence">
                  <a className={styles.red}> Condolence Flowers</a>
                </Link>{" "}
                ,{" "}
                <Link href="/product-category/bridal-bouquets">
                  <a className={styles.red}>Bridal Bouquets</a>
                </Link>{" "}
                , and of course,
                <Link href="/product-category/anniversary-flowers">
                  <a className={styles.red}> Valentine’s Day flowers</a>
                </Link>{" "}
                available
                <br />
                <br />
                And finally, there are suitable options for all budgets, so when
                you see a design you like, you can simply pick the size that
                suits your budget. Want to go all out too? We got you, with our
                <Link href="/vip">
                  <a className={styles.red}> VIP</a>
                </Link>{" "}
                Category of roses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
