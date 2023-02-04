import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dayjs } from "dayjs";
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

type ProductClass = "vip" | "regular";

export interface ProductFilterLogic {
  category: string[];
  tags: string[];
  productClass?: ProductClass;
}

const JustToSayTexts = ["Hi", "Thank You", "Congrats", "Etc"];

type ProductCategory = "vip" | "occasion";

const ProductsPage: FunctionComponent<{
  productCategory: ProductCategory;
  categorySlug?: string;
  productClass?: ProductClass;
}> = props => {
  const { productCategory = "occasion", categorySlug, productClass } = props;

  const router = useRouter();
  const { query, isReady } = router;
  const { selectedOccasion, shopBy } = query;
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(1);
  const [JustToSayText, setJustToSayText] = useState(JustToSayTexts[0]);
  const [pageTitle, setPageTitle] = useState("Flowers");

  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [productsLoading, setproductsLoading] = useState(false);
  const [todayDate, setTodayDate] = useState<Dayjs | null>(null);
  const [filterCategories, setFilterCategories] = useState(filtersCatgories);
  const [sort, setSort] = useState<string>("");
  const [hasMore, setHasMore] = useState(false);
  const [shouldShowFilter, setShouldShowFilter] = useState(false);

  const filterDropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setShouldShowFilter(false);
  });

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
    if (isReady) {
      const filters = String(shopBy || "")
        .split(",")
        .filter(Boolean);
      setSelectedFilter(filters);
    }
  }, [shopBy, isReady]);

  useEffect(() => {
    const intervalId = setInterval(shuffleText, 3000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const handleClearFIlter = () => {
    setSelectedFilter([]);
  };

  const fetchProductCategory = async (shouldAppend?: boolean) => {
    products.length === 0 ? setproductsLoading(true) : setInfiniteLoading(true);
    const filterParams = {
      category: [(categorySlug as string) || ""],
      tags: [(shopBy as string) || ""],
      productClass
    };
    const params: FetchResourceParams<ProductFilterLogic> = {
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
    if (isReady) {
      fetchProductCategory();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, selectedFilter, selectedOccasion, router]);

  useEffect(() => {
    if (isReady) {
      fetchProductCategory(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const flowerTitle = occasions.find(
      item => item.url === `/product-category/${categorySlug}`
    )?.title;
    const giftTitle = gifts.find(
      item => item.url === `/product-category/${categorySlug}`
    )?.title;
    const title = flowerTitle || giftTitle;

    if (title) {
      setPageTitle(title);
    }
  }, [categorySlug]);

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
              {(giftMap[categorySlug || ""] ? gifts : occasions).map(
                (occasion, index) => {
                  return (
                    <Link href={occasion.url} key={index}>
                      <a
                        className={[
                          styles["occasion"],
                          categorySlug !==
                            "gift-items-perfumes-cakes-chocolate-wine-giftsets-and-teddy-bears" &&
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
                  placeholder="Select Date"
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
                              const newFilters = selectedFilter.includes(
                                child.tag || ""
                              )
                                ? selectedFilter.filter(
                                    _filter => _filter !== child.tag
                                  )
                                : [...selectedFilter, child.tag];
                              router.push(
                                `${router.pathname}?shopBy=${newFilters.join(
                                  ","
                                )}`
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
            <h1 className={`${styles.title} bold vertical-margin spaced`}>
              {productCategory === "vip"
                ? "VIP Flower Arrangements"
                : `${pageTitle} ${
                    !giftMap[categorySlug || ""] ? "Flowers" : ""
                  }`}
            </h1>

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
                  url={`/product/${product.slug}`}
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
                Valentine Gifts to Include with Flowers
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
                  subTitle={gift.description}
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
                <Link href="/filters?selectedOccasion=just-to-say">
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
                <Link href="/filters?selectedOccasion=just-to-say">
                  <a className={styles.red}> Birthday Flowers</a>
                </Link>
                ,
                <Link href="/filters?selectedOccasion=just-to-say">
                  <a className={styles.red}> Romantic Flowers</a>
                </Link>
                ,{" "}
                <Link href="/filters?selectedOccasion=Anniversary%20Flowers">
                  <a className={styles.red}> Anniversary Flowers</a>
                </Link>
                , Mothers’ Day Flowers, Get Well Soon Flowers,{" "}
                <Link href="/filters?selectedOccasion=funeral-condolence">
                  <a className={styles.red}> Funeral Wreaths</a>
                </Link>{" "}
                ,{" "}
                <Link href="/filters?selectedOccasion=funeral-condolence">
                  <a className={styles.red}> Condolence Flowers</a>
                </Link>{" "}
                ,{" "}
                <Link href="/filters?selectedOccasion=bridal-bouquets">
                  <a className={styles.red}>Bridal Bouquets</a>
                </Link>{" "}
                , and of course,
                <Link href="/filters?selectedOccasion=Anniversary%20Flowers">
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
