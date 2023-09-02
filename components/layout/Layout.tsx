import React, {
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Link from "next/link";
import styles from "./Layout.module.scss";
import { footerContent, links } from "../../utils/constants";
import SettingsContext, {
  NotifyType
} from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";
import Button from "../button/Button";
import {
  createOrder,
  getOrder,
  updateOrder
} from "../../utils/helpers/data/order";
import dayjs from "dayjs";
import ContextWrapper from "../context-wrapper/ContextWrapper";
import AuthDropdown from "./AuthDropdown";
import useDeviceType from "../../utils/hooks/useDeviceType";
import useOutsideClick from "../../utils/hooks/useOutsideClick";
import Input from "../input/Input";
import { getPriceDisplay } from "../../utils/helpers/type-conversions";
import { CartItem, Design } from "../../utils/types/Core";
import DatePicker from "../date-picker/DatePicker";
import { ProductImage } from "../../utils/types/Product";
import Modal from "../modal/Modal";
import AppStorage, {
  AppStorageConstants
} from "../../utils/helpers/storage-helpers";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { pathname } = useRouter();
  const _pathname = pathname.split("/")[1];
  const deviceType = useDeviceType();

  return (
    <>
      {_pathname === "checkout" && deviceType === "desktop" ? (
        <CheckoutHeader />
      ) : (
        <Header />
      )}
      <main className={styles.main}>
        {deviceType === "mobile" && <CurrencyController />}
        {children}
        {_pathname !== "checkout" && <Footer />}
      </main>
    </>
  );
};

const Footer: FunctionComponent = () => {
  const deviceType = useDeviceType();

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles["footer-wrapper"]}>
        <div className={styles.top}>
          <div>
            <Link href="/">
              <a>
                <img
                  alt="regal flowers logo"
                  src="/icons/logo.png"
                  className={styles.logo}
                />
              </a>
            </Link>
            <p>{footerContent.aboutUs}</p>
            <div className="flex spaced-xl">
              {footerContent.socialIcons.map(icon => (
                <Link key={icon.name} href={icon.url}>
                  <a>
                    <img
                      alt={icon.name}
                      src={icon.src}
                      className="generic-icon medium"
                    />
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div
            className={`${
              deviceType === "mobile" ? "flex between spaced" : ""
            }`}
          >
            <div
              className={`${
                deviceType === "mobile" ? "flex between spaced column" : ""
              }`}
              style={deviceType === "mobile" ? { width: "30%" } : {}}
            >
              <strong>Quick Links</strong>
              {footerContent.quickLinks.map(link => (
                <Link key={link.title} href={link.url}>
                  <a>{link.title}</a>
                </Link>
              ))}
            </div>
            <div
              className={`${
                deviceType === "mobile" ? "flex between spaced column" : ""
              }`}
              style={deviceType === "mobile" ? { width: "65%" } : {}}
            >
              <strong>Get In Touch</strong>
              <div className="flex spaced-xl">
                <img
                  className="generic-icon medium"
                  src="/icons/footer/phone.svg"
                  alt="phone"
                />
                <Link href="https://wa.me/+2348188787788">
                  <a>
                    <img
                      className="generic-icon medium"
                      src="/icons/footer/whatsapp.svg"
                      alt="whtasapp"
                    />
                  </a>
                </Link>
              </div>
              {footerContent.phoneNumbers.map(number => (
                <p key={number}>{number}</p>
              ))}
              <div className="flex spaced center-align">
                <img
                  className="generic-icon"
                  src="/icons/footer/message.svg"
                  alt="message"
                />
                <span>info@regalflowers.com.ng</span>
              </div>
            </div>
          </div>
          <div>
            <strong>Payment Information</strong>
            <strong>Bank Transfers</strong>
            <div className="flex spaced">
              <span>Bank:</span> <strong>GTBank</strong>
            </div>
            <div className="flex spaced">
              <span>Account Number: </span> <strong>0252862666</strong>
            </div>
            <div className="flex spaced">
              <span>Account Name: </span> <strong>Regal Flowers Ltd</strong>
            </div>
            <strong>Paypal</strong>
            <div
              className={`flex spaced ${
                deviceType === "mobile" ? "column" : ""
              }`}
            >
              <span>Email:</span>{" "}
              <strong>paypalpayments@regalflowers.com.ng</strong>
            </div>
            <strong>Bitcoin</strong>
            <div className="">
              <span>Address: </span>{" "}
              <strong>12W9vKCcCbKFmYr9bYfbd9SqVvhyK5j4E1</strong>
            </div>
          </div>
        </div>
        <br />
        <div>
          <div className={styles.middle}>
            <div>
              <strong className="normal-text">Lagos Locations</strong>
              <div className={styles.branches}>
                <div className={styles.branch}>
                  <strong>Head Office</strong>
                  <p>81b, Lafiaji Way, Dolphin Estate, Ikoyi, Lagos.</p>
                  <p className={styles.grayed}>Open 24/7</p>
                </div>
                <div className={styles.branch}>
                  <strong>VI Branch</strong>
                  <p>
                    133, Ahmadu Bello Way, Silverbird Galleria, Victoria Island,
                    Lagos.
                  </p>
                  <p className={styles.grayed}> 8am-7pm (Everyday)</p>
                </div>
                <div className={styles.branch}>
                  <strong>Airport Branch</strong>
                  <p>Muritala Muhammad Airport2, Ikeja, Lagos.</p>
                  <p className={styles.grayed}> 8am-7pm (Everyday)</p>
                </div>
              </div>
            </div>
            <div>
              <strong className="normal-text">Abuja Location</strong>
              <div
                className={deviceType === "mobile" ? "margin-left spaced" : ""}
              >
                <strong>Wuse 2 Branch</strong>
                <p>
                  5, Nairobi Street, off Aminu Kano Crescent, Wuse 2, Abuja.
                </p>
                <p className={styles.grayed}>Open 24/7</p>
              </div>
            </div>

            <div id={styles.newsletter}>
              <strong>Subscribe to Newsletter</strong>
              <div className="flex spaced">
                <Input
                  value=""
                  onChange={() => {}}
                  placeholder="Enter your email"
                  className={styles.input}
                />
                <Button className={styles["subsribe-btn"]}>Subscribe</Button>
              </div>
              <p className={`margin-top ${styles.grayed}`}>
                We care about your data
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© 2023 Regal Flowers.</p>

        <div
          className={`flex between ${
            deviceType === "desktop" ? "spaced-xl" : "spaced"
          } ${styles["payment-icon"]}`}
        >
          <img
            src="/icons/visa.svg"
            alt="visa"
            className="generic-icon large"
          />
          <img
            src="/icons/master-card.svg"
            alt="master card"
            className="generic-icon large"
          />
          <img
            src="/icons/paypal-blue.svg"
            alt="paypal"
            className="generic-icon large"
          />
          <img
            src="/icons/bitcoin-gold.svg"
            alt="bitcoin"
            className="generic-icon large"
          />
          <img
            src="/icons/building-white.svg"
            alt="bank"
            className="generic-icon large"
          />
          <img
            src="/icons/paystack.svg"
            alt="pay stack"
            className="generic-icon large"
          />
        </div>
        {deviceType === "desktop" && (
          <Link href="#top">
            <a className="flex spaced center-align">
              <span>Scroll to top</span>
              <svg
                width="10"
                height="13"
                viewBox="0 0 10 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="generic-icon"
              >
                <path
                  d="M1 5.66602L5 1.66602M5 1.66602L9 5.66602M5 1.66602L5 11.666"
                  stroke="white"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </Link>
        )}
      </div>
    </footer>
  );
};

const CurrencyController = () => {
  const { currency, setCurrency, allCurrencies } = useContext(SettingsContext);
  const [shouldShowCurrency, setShouldShowCurrency] = useState(false);

  return (
    <div className={styles["currency-wrapper"]}>
      <div
        className={[
          styles["currency-controller"],
          shouldShowCurrency && styles.active
        ].join(" ")}
        onClick={() => setShouldShowCurrency(true)}
      >
        <span>
          {
            allCurrencies.find(_currency => _currency.name === currency.name)
              ?.sign
          }
        </span>
      </div>
      <div
        className={[
          styles.currencies,
          shouldShowCurrency && styles["show-currencies"]
        ].join(" ")}
      >
        <div
          className={styles["down-arrow"]}
          onClick={() => setShouldShowCurrency(false)}
        ></div>
        {allCurrencies.map(_currency => (
          <button
            key={_currency.name}
            onClick={() => {
              setCurrency(_currency);
              setShouldShowCurrency(false);
            }}
            className={[
              styles.currency,
              currency.name === _currency.name && styles.active
            ].join(" ")}
          >
            {_currency.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const Header: FunctionComponent = () => {
  const [activeNavLink, setActiveNavLink] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSublinkNav, setActiveSublinkNav] = useState("");

  const deviceType = useDeviceType();

  const { pathname } = useRouter();
  const _pathname = pathname.split("/")[1];

  const {
    currency,
    setCurrency,
    cartItems,
    user,
    allCurrencies,
    setShouldShowCart,
    shouldShowCart,
    setOrder,
    setCurrentStage,
    setDeliveryDate,
    orderId,
    shouldShowAuthDropdown,
    setShouldShowAuthDropdown
  } = useContext(SettingsContext);

  const authDropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setShouldShowAuthDropdown(false);
  });

  const totalCartItems = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const handleActiveNav = (title: string, e: ReactMouseEvent) => {
    setActiveNavLink(title);
    e.stopPropagation();
  };

  useEffect(() => {
    if (!orderId && _pathname !== "checkout") {
      setOrder(null);
      setCurrentStage(1);
      setDeliveryDate(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_pathname]);

  const accountAnchor = (
    <button className="flex column center-align">
      {user ? (
        <span className={[styles.initial, styles["control-icon"]].join(" ")}>
          {(user.name || user.email)[0]}
        </span>
      ) : (
        <img
          alt="user"
          src="/icons/user.svg"
          className={styles["control-icon"]}
        />
      )}
      {deviceType === "desktop" && <span>Account</span>}
    </button>
  );

  return (
    <>
      <header className={styles.header} id="top">
        <img
          alt="menu"
          src={`${
            showSidebar ? "/icons/cancel-menu.svg" : "/icons/hamburger-menu.svg"
          }`}
          className={styles["hamburger-menu"]}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        {deviceType === "mobile" && (
          <nav
            className={[
              styles["mobile-sidebar"],
              showSidebar && styles.active
            ].join(" ")}
          >
            {links.map((link, index) => (
              <div className={styles.link} key={index}>
                {link.url ? (
                  <Link href={link.url} key={link.title}>
                    <a
                      className={`flex center-align spaced ${styles.title}`}
                      onClick={() => {
                        setActiveNavLink(link.title);
                        !link.children.length && setShowSidebar(false);
                      }}
                    >
                      <strong>{link.title}</strong>
                      {link.children.length > 0 && (
                        <div className={[styles.arrow].join(" ")}></div>
                      )}
                    </a>
                  </Link>
                ) : (
                  <div
                    className={`flex center-align spaced ${styles.title}`}
                    onClick={() => {
                      setActiveNavLink(link.title);
                      !link.children.length && setShowSidebar(false);
                    }}
                    key={link.title}
                  >
                    <strong>{link.title}</strong>
                    {link.children.length > 0 && (
                      <div className={[styles.arrow].join(" ")}></div>
                    )}
                  </div>
                )}

                <div>
                  {link.children.length > 0 && (
                    <div
                      className={[
                        styles["sub-link"],
                        activeNavLink === link.title && styles.active
                      ].join(" ")}
                    >
                      <div
                        className={styles.back}
                        onClick={() => {
                          setActiveNavLink("");
                          setShowSidebar(true);
                        }}
                      >
                        <div className={styles["back-arrow"]}></div>
                        Back
                      </div>

                      {link.children.map((child, index) => (
                        <div key={index}>
                          {child.url ? (
                            <Link href={child.url} key={index}>
                              <a
                                className={styles["sub-link-title"]}
                                onClick={() => {
                                  setActiveNavLink("");
                                  setShowSidebar(false);
                                  setActiveSublinkNav("");
                                }}
                              >
                                {child.title && <p>{child.title}</p>}
                              </a>
                            </Link>
                          ) : (
                            <div
                              className={styles["sub-link-title"]}
                              onClick={() => {
                                setActiveSublinkNav(child.title);
                              }}
                              key={index}
                            >
                              <strong>{child.title}</strong>
                              {child.children.length > 0 && (
                                <div className={[styles.arrow].join(" ")}></div>
                              )}
                            </div>
                          )}
                          <div
                            className={[
                              styles["sub-child"],
                              activeSublinkNav === child.title && styles.active
                            ].join(" ")}
                          >
                            <div
                              className={styles.back}
                              onClick={() => {
                                setActiveNavLink(link.title);
                                setActiveSublinkNav("");
                              }}
                            >
                              <div className={styles["back-arrow"]}></div>
                              Back
                            </div>
                            {child.children.map((subChild, index) => (
                              <Link href={subChild.url} key={index}>
                                <a
                                  className={styles["sub-link-title"]}
                                  onClick={() => {
                                    setActiveNavLink("");
                                    setShowSidebar(false);
                                    setActiveSublinkNav("");
                                  }}
                                >
                                  {subChild.title && <p>{subChild.title}</p>}
                                </a>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>
        )}
        <Link href="/">
          <a>
            <img
              alt="regal flowers logo"
              src="/icons/logo.png"
              className={styles.logo}
              onClick={() => setShowSidebar(false)}
            />
          </a>
        </Link>
        {deviceType === "desktop" && (
          <nav className={styles.nav}>
            {links.map((link, index) => (
              <div
                className={styles.link}
                key={index}
                onMouseEnter={e => handleActiveNav(link.title, e)}
                onMouseLeave={() => setActiveNavLink("")}
              >
                <div
                  className={`flex center-align spaced  ${styles.title}`}
                  key={link.title}
                  role="button"
                >
                  {link.url ? (
                    <Link href={link.url}>
                      <a>
                        <strong>{link.title}</strong>
                      </a>
                    </Link>
                  ) : (
                    <strong>{link.title}</strong>
                  )}
                  {link.children.length > 0 && (
                    <div
                      className={[
                        styles.arrow,
                        activeNavLink === link.title && activeNavLink
                          ? styles.active
                          : ""
                      ].join(" ")}
                    ></div>
                  )}
                </div>
                {link.children.length > 0 && (
                  <div
                    className={[
                      styles["dropdown"],
                      activeNavLink === link.title && styles.active
                    ].join(" ")}
                  >
                    {link.subtitle && (
                      <p className={styles.subtitle}>{link.subtitle}</p>
                    )}
                    <div
                      className={[
                        styles["sub-link"],
                        link.children.some(child => child.children.length) &&
                          styles.grid
                      ].join(" ")}
                    >
                      {link.children.map((child, index) => (
                        <div key={index}>
                          {child.url ? (
                            <Link href={child.url}>
                              <a
                                onClick={() => {
                                  setActiveNavLink("");
                                }}
                              >
                                {child.title && (
                                  <span
                                    className={[
                                      child.children.length && styles.title
                                    ].join(" ")}
                                  >
                                    {child.title}
                                  </span>
                                )}
                              </a>
                            </Link>
                          ) : (
                            <>
                              {child.title && (
                                <span
                                  className={[
                                    child.children.length && styles.title
                                  ].join(" ")}
                                >
                                  {child.title}
                                </span>
                              )}
                            </>
                          )}
                          <div className={styles["grand-children"]}>
                            {child.children.map((grandChild, index) => (
                              <Link href={grandChild.url} key={index}>
                                <a
                                  className={styles["grand-title"]}
                                  onClick={() => {
                                    setActiveNavLink("");
                                  }}
                                >
                                  {grandChild.title}
                                </a>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
        <div
          className={[styles["controls-area-mobile"], "flex spaced-lg"].join(
            " "
          )}
        >
          <div>
            <div className={styles["auth-wrapper"]} ref={authDropdownRef}>
              <div
                className={[
                  styles["auth-dropdown"],
                  shouldShowAuthDropdown && styles.active
                ].join(" ")}
              >
                <AuthDropdown />
              </div>
            </div>
          </div>
          <ContextWrapper
            anchor={accountAnchor}
            className={styles["auth-wrapper"]}
          >
            <AuthDropdown />
          </ContextWrapper>

          <button
            className={[styles["cart-btn"]].join(" ")}
            onClick={() => {
              setShouldShowCart(!shouldShowCart);
            }}
          >
            <svg
              width="29"
              height="24"
              viewBox="0 0 24 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["control-icon"]}
            >
              <path
                d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>{totalCartItems}</span>
          </button>
        </div>
        <div className={styles["controls-area"]}>
          <div
            className={["flex", "spaced", styles["currency-control"]].join(" ")}
          >
            <span>Currency:</span>
            {allCurrencies.map(_currency => (
              <button
                key={_currency.name}
                onClick={() => setCurrency(_currency)}
                className={[
                  styles.currency,
                  currency.name === _currency.name && styles.active
                ].join(" ")}
              >
                {_currency.name}
              </button>
            ))}
          </div>
          <div className="flex spaced-lg">
            <div className={styles.group}>
              <ContextWrapper anchor={accountAnchor}>
                <AuthDropdown />
              </ContextWrapper>
            </div>
            <button
              className={[
                "flex",
                "column",
                "center-align",
                shouldShowCart && "primary-color"
              ].join(" ")}
              onClick={e => {
                setShouldShowCart(true);
                e.stopPropagation();
              }}
            >
              <svg
                width="29"
                height="24"
                viewBox="0 0 24 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles["control-icon"]}
              >
                <path
                  d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {totalCartItems ? (
                <strong>Cart ({totalCartItems})</strong>
              ) : (
                <span>Cart ({totalCartItems})</span>
              )}
            </button>
            <a
              className="flex column center-align"
              href={`${_pathname === "" ? "#contactSection" : "#footer"}`}
            >
              <img
                alt="phone"
                src="/icons/phone.svg"
                className={styles["control-icon"]}
              />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </header>
      <CartContext
        visible={shouldShowCart}
        cancel={() => setShouldShowCart(false)}
      />
    </>
  );
};

interface CartContextProps {
  visible: boolean;
  cancel: () => void;
  header?: "checkout" | "main";
  cartItems?: CartItem[];
}

const CartContext: FunctionComponent<CartContextProps> = props => {
  const { visible, cancel, header = "main" } = props;

  const {
    cartItems,
    setCartItems,
    deliveryDate,
    setDeliveryDate,
    currency,
    notify,
    orderId,
    setOrderId,
    setOrder,
    setShouldShowCart,
    currentStage,
    confirm,
    setOrderLoading
  } = useContext(SettingsContext);
  const [loading, setLoading] = useState(false);

  const totalCartItems = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { push } = router;

  const handleCloseCart = (e: MouseEvent) => {
    const cartBody = cartRef.current;
    const backdrop = backdropRef.current;
    if (!cartBody || !cartBody.contains(e.target as Node)) {
      if (backdrop?.contains(e.target as Node)) cancel();
    }
  };

  const fetchOrder = async (orderId: string) => {
    setOrderLoading(true);
    const { error, data, status } = await getOrder(orderId);

    if (error) {
      if (status === 404) {
        setOrderId("");
        setOrder(null);
        setCartItems([]);
        setDeliveryDate(null);
        push("/");
      }
    } else {
      const _isPaid =
        /go\s*ahead/i.test(data?.paymentStatus || "") ||
        /^paid/i.test(data?.paymentStatus || "");

      if (!_isPaid) {
        const _cartItems: CartItem[] =
          data?.orderProducts?.map(item => ({
            image: item.image as ProductImage,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            key: item.key,
            // design: item.design,  //add design later
            size: item.size,
            description: item.description,
            cartId: item.size || "" + item.key
          })) || [];
        setCartItems(_cartItems);
      }

      setOrder(data);
      setDeliveryDate(data?.deliveryDate ? dayjs(data?.deliveryDate) : null);
    }
    setOrderLoading(false);
  };

  const handleRemoveItemQuantity = (key: string) => {
    const item = cartItems.find(item => item.cartId === key);
    if (item) {
      if (item.quantity > 1) {
        setCartItems(
          cartItems.map(item => {
            if (item.cartId === key) {
              return {
                ...item,
                quantity: item.quantity - 1,
                design: item.design && {
                  ...item.design,
                  quantity: (item.design?.quantity as number) - 1
                }
              };
            }
            return item;
          })
        );
      }
    }
  };

  const handleAddItemQuantity = (key: string) => {
    const item = cartItems.find(item => item.cartId === key);
    if (item) {
      setCartItems(
        cartItems.map(item => {
          if (item.cartId === key) {
            return {
              ...item,
              quantity: item.quantity + 1,
              design:
                item.design &&
                ({
                  ...item.design,
                  quantity: (item.design?.quantity as number) + 1
                } as Design)
            };
          }
          return item;
        })
      );
    }
  };

  const total = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleCloseCart);
    }
    return () => {
      document.removeEventListener("mousedown", handleCloseCart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleCreateOrder = async () => {
    setLoading(true);

    const { data, error, message } = await createOrder({
      cartItems,
      deliveryDate: deliveryDate?.format("YYYY-MM-DD") || "",
      currency: currency.name
    });

    setLoading(false);
    if (error) {
      notify("error", `Unable to create order: ${message}`);
    } else if (data) {
      setDeliveryDate(data.deliveryDate ? dayjs(data?.deliveryDate) : null);
      setOrderId(data.id);
      router.push(`/checkout?orderId=${data.id}`);
      setShouldShowCart(false);
    }
  };

  const handleUpdateOrder = async (clearCartItems: boolean) => {
    setLoading(true);

    const { data, error, message } = await updateOrder({
      cartItems: clearCartItems ? null : cartItems,
      deliveryDate: deliveryDate?.format("YYYY-MM-DD") || "",
      id: orderId as string,
      currency: currency.name
    });

    setLoading(false);
    if (error) {
      notify("error", `Unable to update order: ${message}`);
    } else if (data) {
      setOrder(data);
      setDeliveryDate(data.deliveryDate ? dayjs(data?.deliveryDate) : null);

      if (header === "main" && !clearCartItems) {
        router.push(`/checkout?orderId=${data.id}`);
      }

      if (clearCartItems && header === "checkout") {
        router.push(`/`);
      }

      setShouldShowCart(false);
    }
  };

  const handleRemoveItem = (key: string) => {
    confirm({
      title: "Delete item",
      body: "Do you really want to delete this?",
      onOk: () => {},
      onCancel: () => {
        if (cartItems.length === 1) {
          handleUpdateOrder(true);
          setCartItems([]);
          return;
        }
        setCartItems(prevState => {
          return prevState.filter(item => item.cartId !== key);
        });
      },
      okText: "Don't Delete",
      cancelText: "Delete"
    });
  };

  const designCharges = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const designTotal =
        item.design && item?.design.price * item.design.quantity;
      return total + (designTotal || 0);
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      const savedCartItems = AppStorage.get(AppStorageConstants.CART_ITEMS);
      if (savedCartItems) {
        setCartItems(savedCartItems);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, currentStage]);

  return (
    <div
      className={[
        styles.backdrop,
        visible && styles.active,
        visible && "scrollable"
      ].join(" ")}
      ref={backdropRef}
    >
      <div
        ref={cartRef}
        className={[
          styles["cart-context"],
          visible && styles.active,
          visible && "scrollable"
        ].join(" ")}
      >
        <div className={styles["cart-header"]}>
          <h3 className="sub-heading bold">My Cart ({totalCartItems})</h3>
          <img
            src="/icons/cancel-cart.svg"
            className="generic-icon medium clickable"
            alt="cancel"
            onClick={cancel}
          />
        </div>
        <div className={styles["body"]}>
          {cartItems.length ? (
            <div className={styles["delivery-status"]}>
              <span>Pickup/Delivery date</span>
              <span>{deliveryDate?.format("D MMM YYYY") || "Not set yet"}</span>
              {/* <span className="underline primary-color">Edit</span> */}
              {!deliveryDate && (
                <DatePicker
                  value={deliveryDate}
                  onChange={setDeliveryDate}
                  format="D MMM YYYY"
                  className={styles["delivery-date"]}
                  placeholder="Edit"
                  iconAtLeft
                  content={<p className="underline primary-color">Edit</p>}
                  dropdownAlignment="right"
                  disablePastDays
                />
              )}
            </div>
          ) : (
            ""
          )}
          {cartItems.length ? (
            cartItems?.map((item, i) => (
              <div className={styles["cart-item"]} key={i}>
                <img
                  src="/icons/delete-cart.svg"
                  alt="delete"
                  className="generic-icon medium margin-top spaced clickable"
                  onClick={() => handleRemoveItem(item?.cartId)}
                />
                <div className="flex spaced align-center block">
                  <img
                    src={item.image.src}
                    alt="product"
                    className={styles["product-image"]}
                  />
                  <div className="flex-one">
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <div className="flex between center-align vertical-margin">
                      <p className="primary-color normal-text bold">
                        {getPriceDisplay(item.price, currency)}
                      </p>
                      <div className="flex center-align spaced-lg">
                        <div
                          className={styles.minus}
                          onClick={() => handleRemoveItemQuantity(item.cartId)}
                        ></div>
                        <span className="small-text">{item.quantity}</span>
                        <div
                          className={styles.plus}
                          onClick={() => handleAddItemQuantity(item.cartId)}
                        ></div>
                      </div>
                    </div>
                    {item.size && (
                      <p className="capitalize">Size: {item.size}</p>
                    )}
                    {item.design && (
                      <p className="vertical-margin capitalize">
                        Design: {`${item.design.title}`} {"  "}
                        {item.design.price ? (
                          <span>
                            {`+ ${getPriceDisplay(
                              item.design.price,
                              currency
                            )} x ${item.design.quantity}`}
                          </span>
                        ) : (
                          ""
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles["empty-cart"]}>Empty Cart</div>
          )}
          {cartItems.length ? (
            <>
              <div className="flex between center-align vertical-margin spaced">
                <span className="normal-text">Subtotal</span>
                <strong className="normal-text">
                  {getPriceDisplay(total, currency)}
                </strong>
              </div>
              <div className="flex between center-align margin-bottom spaced">
                <span className="normal-text">Add-ons</span>
                <strong className="normal-text">
                  {getPriceDisplay(designCharges, currency)}
                </strong>
              </div>
              <div className="flex between center-align margin-bottom spaced">
                <span className="normal-text">Total</span>
                <strong className="normal-text">
                  {getPriceDisplay(total + designCharges, currency)}
                </strong>
              </div>
            </>
          ) : (
            ""
          )}
          <Button
            responsive
            className="margin-top spaced capitalize"
            onClick={() =>
              orderId ? handleUpdateOrder(false) : handleCreateOrder()
            }
            loading={loading}
            disabled={!cartItems.length}
          >
            {header === "main" ? "Proceed to checkout" : "Update Cart"} (
            {getPriceDisplay(total + designCharges, currency)})
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CheckoutHeader: FunctionComponent = () => {
  const {
    currentStage,
    setShouldShowCart,
    shouldShowCart,
    shouldShowAuthDropdown,
    setShouldShowAuthDropdown
  } = useContext(SettingsContext);
  const authDropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setShouldShowAuthDropdown(false);
  });

  const stages = [
    {
      name: "delivery",
      stage: 1
    },
    {
      name: "payment",
      stage: 2
    },
    {
      name: "done",
      stage: 3
    }
  ];

  return (
    <>
      <header className={styles.header}>
        <Link href="/">
          <a>
            <img
              alt="regal flowers logo"
              src="/icons/logo.png"
              className={styles.logo}
            />
          </a>
        </Link>

        <div className={styles["stage-wrapper"]}>
          <div className="flex center margin-bottom">
            {stages.map((_stage, index) => (
              <div
                key={index}
                className={[
                  styles.progress,
                  currentStage === _stage.stage && styles.active
                ].join(" ")}
              >
                {_stage.stage > 1 && (
                  <hr
                    className={[
                      styles["progress-bar"],
                      currentStage >= _stage.stage && styles.active
                    ].join(" ")}
                  />
                )}
                <span
                  className={[
                    styles.circle,
                    currentStage > _stage.stage && styles.completed,
                    currentStage === _stage.stage && styles.active
                  ].join(" ")}
                ></span>
              </div>
            ))}
          </div>
          <div className="flex around">
            {stages.map((_stage, index) => (
              <span
                key={index}
                className={[
                  styles["stage-name"],
                  currentStage === _stage.stage && styles.active,
                  currentStage > _stage.stage && styles.completed
                ].join(" ")}
              >
                {_stage.name}
              </span>
            ))}
          </div>
        </div>
      </header>
      <CartContext
        visible={shouldShowCart}
        cancel={() => setShouldShowCart(false)}
        header="checkout"
      />
      <div className={styles["auth-wrapper"]} ref={authDropdownRef}>
        <div
          className={[
            styles["auth-dropdown"],
            shouldShowAuthDropdown && styles.active
          ].join(" ")}
        >
          <AuthDropdown />
        </div>
      </div>
    </>
  );
};

interface ToasterProps {
  cancel: () => void;
  toasterParams: { message?: string; type?: NotifyType };
  visible: boolean;
}

export const Toaster = (props: ToasterProps) => {
  const { visible, toasterParams, cancel } = props;
  const { type, message } = toasterParams;

  const iconsMap = {
    success: "/icons/check.svg",
    error: "/icons/cancel.svg",
    info: "/icons/blue-info.svg"
  };

  return (
    <div
      className={[
        styles.toaster,
        styles[type ?? "success"],
        visible && styles.active
      ].join(" ")}
    >
      <div className={styles["icon-wrapper"]}>
        <img
          alt="notify"
          className={styles.icon}
          src={iconsMap[type ?? "success"]}
        />
      </div>
      <span className={styles.message}>{message}</span>
      <div onClick={cancel} className={styles["close-icon"]}>
        <div className={styles.bar} />
        <div className={styles.bar} />
      </div>
    </div>
  );
};

export interface ConfirmParams {
  title: string;
  onOk: () => void;
  body?: string;
  okText?: string;
  cancelText?: string;
  onCancel?: () => void;
}

interface ConfirmModalProps {
  cancel?: () => void;
  confirmParams: ConfirmParams;
  visible: boolean;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const [loading, setLoading] = useState(false);

  const { visible, cancel, confirmParams } = props;
  const {
    okText = "Yes",
    cancelText = "No",
    onOk = () => {},
    onCancel = () => {},
    title = "Are you sure?",
    body = "This action is irreversible"
  } = confirmParams;

  const handleClick = async () => {
    setLoading(true);
    try {
      await onOk();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    cancel?.();
  };

  const handleCancel = () => {
    onCancel();
    cancel?.();
  };

  return (
    <Modal visible={visible} isConfirm>
      <h2 className={styles["confirm-title"]}>{title}</h2>
      <p className={styles["confirm-body"]}>{body}</p>
      <div className="flex vertical-margin end">
        <Button type="accent" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button
          loading={loading}
          type="primary"
          onClick={handleClick}
          className="margin-left spaced"
        >
          {okText}
        </Button>
      </div>
    </Modal>
  );
};

export default Layout;
