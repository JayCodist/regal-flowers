import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs, { Dayjs } from "dayjs";
import { getProductsByCategory } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";
import Checkbox from "../components/checkbox/Checkbox";
import FlowerCard from "../components/flower-card/FlowerCard";
import {
  aboutUsContent,
  filtersCatgories,
  giftItems,
  gifts,
  occasions,
  sortOptions
} from "../utils/constants";
import DatePicker from "../components/date-picker/DatePicker";
import Select from "../components/select/Select";
import { FetchResourceParams } from "../utils/types/FetchResourceParams";
import useScrollHandler from "../utils/hooks/useScrollHandler";
import useDeviceType from "../utils/hooks/useDeviceType";
import Button from "../components/button/Button";
import useOutsideClick from "../utils/hooks/useOutsideClick";
import styles from "./filters.module.scss";
import SettingsContext from "../utils/context/SettingsContext";

const giftMap: Record<string, string> = {
  "gift-items-perfumes-cakes-chocolate-wine-giftsets-and-teddy-bears":
    "gift-items-perfumes-cakes-chocolate-wine-giftsets-and-teddy-bears",
  "chocolate-and-biscuits": "chocolate-and-biscuits",
  "cakes-and-cupcakes": "cakes-and-cupcakes",
  "teddy-bears": "teddy-bears",
  "wine-and-champagne": "wine-and-champagne",
  perfumes: "perfumes",
  balloon: "balloon"
};

const JustToSayTexts = ["Hi", "Thank You", "Congrats", "Etc"];

type ProductCategory = "vip" | "occasion" | "gift-packs";

const ProductsPage: FunctionComponent<{
  productCategory: ProductCategory;
  categorySlug?: string;
}> = props => {
  const { productCategory = "occasion", categorySlug } = props;

  const router = useRouter();
  const { query, isReady } = router;
  const { selectedOccasion, shopBy } = query;
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(1);
  const [JustToSayText, setJustToSayText] = useState(JustToSayTexts[0]);

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

  useEffect(() => {
    if (isReady) {
      const filters = String(shopBy || "")
        .split(",")
        .filter(Boolean);
      setSelectedFilter(filters);
    }
  }, [shopBy, isReady]);

  const { notify } = useContext(SettingsContext);

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

  const handleFilterCategoryChange = (name: string) => {
    setSelectedFilter(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
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
  };

  const fetchProductCategory = async (shouldAppend?: boolean) => {
    products.length === 0 ? setproductsLoading(true) : setInfiniteLoading(true);
    const filterParams = {
      category: [categorySlug as string],
      tags: [shopBy as string],
      productClass: productCategory === "vip" ? "vip" : "regular"
    };
    const params: FetchResourceParams = {
      pageNumber: page,
      filter: filterParams
    };

    const response = await getProductsByCategory(params);
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
    products.length === 0
      ? setproductsLoading(false)
      : setInfiniteLoading(false);
  };

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
    fetchProductCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    categorySlug,
    selectedFilter,
    selectedTagCategories,
    selectedOccasion,
    router
  ]);

  useEffect(() => {
    fetchProductCategory(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
          {productCategory === "occasion" && (
            <div className={styles["occasion-wrapper"]}>
              {(giftMap[categorySlug || "1"] ? gifts : occasions).map(
                (occasion, index) => {
                  return (
                    <Link href={occasion.url} key={index}>
                      <a
                        className={[
                          styles["occasion"],
                          categorySlug !== "gift-packs" &&
                            categorySlug === occasion.url.split("/")[2] &&
                            styles["active"]
                        ].join(" ")}
                        onClick={() => {
                          router.push(occasion.url);
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
                }
              )}
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
                  ).map((child, i) => (
                    <div key={i} className="margin-bottom">
                      <Checkbox
                        onChange={() => {
                          const newFilters = selectedFilter.includes(
                            child.tag || ""
                          )
                            ? selectedFilter.filter(
                                _filter => _filter !== child.tag
                              )
                            : [...selectedFilter, child.tag];
                          router.push(
                            `${router.pathname}?shopBy=${newFilters.join(",")}`
                          );
                        }}
                        text={child.name}
                        checked={selectedFilter.includes(child.tag || "")}
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
                                ? handleFilterCategoryChange(child.name)
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
              {productCategory === "vip"
                ? "VIP Flower Arrangements"
                : giftMap[categorySlug || ""]
                ? "Gifts"
                : " Flowers"}
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
                  name={product.name.split("–")[0]}
                  image={product.images[0].src}
                  price={product.price}
                  buttonText="Add to Cart"
                  subTitle={product.name.split("–")[1]}
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
        {!giftMap[categorySlug || ""] && (
          <>
            <div className="flex between margin-bottom spaced">
              <span className={styles.title}>
                Gifts to Include with Flowers
              </span>
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
              {giftItems.map((gift, index) => (
                <FlowerCard
                  key={index}
                  name={gift.name}
                  image={gift.image}
                  subTitle={"Cakes and cupcakes are a great choice"}
                  buttonText="See More"
                  url={gift.slug}
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
            )}{" "}
          </>
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

export default ProductsPage;
