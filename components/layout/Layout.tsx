import React, {
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import Link from "next/link";
import styles from "./Layout.module.scss";
import { AppCurrency } from "../../utils/types/Core";
import { defaultCurrency, links } from "../../utils/constants";
import SettingsContext, {
  NotifyType
} from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";
import Button from "../button/Button";
import { createOrder } from "../../utils/helpers/data/order";
import dayjs from "dayjs";
import ContextWrapper from "../context-wrapper/ContextWrapper";
import AuthDropdown from "./AuthDropdown";
import useOutsideClick from "../../utils/hooks/useOutsideClick";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { pathname } = useRouter();
  const _pathname = pathname.split("/")[1];

  return (
    <>
      {_pathname === "checkout" ? <CheckoutHeader /> : <Header />}
      <main className={styles.main}>{children}</main>
    </>
  );
};

const Header: FunctionComponent = () => {
  const [shouldShowCart, setShouldShowCart] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const currencyOptions: AppCurrency[] = [
    { ...defaultCurrency },
    { name: "USD", conversionRate: 415 },
    { name: "GBP", conversionRate: 523 }
  ];

  const { currency, setCurrency, cartItems, user } = useContext(
    SettingsContext
  );

  const handleActiveNav = (title: string) => {
    setActiveNav(title === activeNav ? "" : title);
  };

  const _subLinkRef = useOutsideClick<HTMLDivElement>(() => {
    setActiveNav("");
  });

  useEffect(() => {
    if (!activeNav && showSidebar) {
      setShowSidebar(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNav]);

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
      <span>Account</span>
    </button>
  );

  return (
    <>
      <header className={styles.header}>
        <img
          alt="menu"
          src={`${
            showSidebar
              ? "./icons/cancel-menu.svg"
              : "./icons/hamburger-menu.svg"
          }`}
          className={styles["hamburger-menu"]}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        <nav
          className={[
            styles["mobile-sidebar"],
            showSidebar && styles.active
          ].join(" ")}
        >
          {links.map((link, index) => (
            <div className={styles.link} key={index} ref={_subLinkRef}>
              <Link href={link.url} key={link.title}>
                <a
                  className={`flex center-align spaced ${styles.title}`}
                  onClick={() => {
                    setActiveNav(link.title);
                    !link.children.length && setShowSidebar(false);
                  }}
                >
                  <strong>{link.title}</strong>
                  {link.children.length > 0 && (
                    <div className={[styles.arrow].join(" ")}></div>
                  )}
                </a>
              </Link>
              <div>
                {link.children.length > 0 && (
                  <div
                    className={[
                      styles["sub-link"],
                      activeNav === link.title && styles.active
                    ].join(" ")}
                  >
                    <div
                      className={styles.back}
                      onClick={() => {
                        setActiveNav("");
                        setShowSidebar(true);
                      }}
                    >
                      <div className={styles["back-arrow"]}></div>
                      Back
                    </div>

                    {link.children.map((child, index) => (
                      <Link href={child.url} key={index}>
                        <a
                          className={styles["sub-link-title"]}
                          onClick={() => handleActiveNav(link.title)}
                        >
                          {child.title && <p>{child.title}</p>}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>
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
        <nav className={styles.nav}>
          {links.map((link, index) => (
            <div className={styles.link} key={index} ref={_subLinkRef}>
              <span
                className={`flex center-align spaced ${styles.title}`}
                onClick={() => handleActiveNav(link.title)}
                key={link.title}
                role="button"
              >
                <strong>{link.title}</strong>
                {link.children.length > 0 && (
                  <div className={[styles.arrow].join(" ")}></div>
                )}
              </span>
              <div>
                {link.children.length > 0 && (
                  <div
                    className={[
                      styles["dropdown"],
                      activeNav === link.title && styles.active
                    ].join(" ")}
                  >
                    <p className={styles.subtitle}>{link.subtitle}</p>
                    <div className={[styles["sub-link"]].join(" ")}>
                      {link.children.map((child, index) => (
                        <Link href={child.url} key={index}>
                          <a>
                            {child.title && <span>{child.title}</span>}
                            <div>
                              {child.children.map((grandChild, index) => (
                                <p
                                  key={index}
                                  className={styles["grand-title"]}
                                >
                                  {grandChild.title}
                                </p>
                              ))}
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>
        <div
          className={[styles["controls-area-mobile"], "flex spaced-lg"].join(
            " "
          )}
        >
          <button>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["control-icon"]}
            >
              <path
                d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
                fill="#4B5563"
              />
            </svg>
          </button>
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

            <span>{cartItems.length}</span>
          </button>
        </div>
        <div className={styles["controls-area"]}>
          <div className="flex spaced">
            <span>Currency:</span>
            {currencyOptions.map(_currency => (
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
                setShouldShowCart(!shouldShowCart);
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

              <span>Cart ({cartItems.length})</span>
            </button>
            <a className="flex column center-align" href="#contactSection">
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
}

const CartContext: FunctionComponent<CartContextProps> = props => {
  const { visible, cancel } = props;

  const { cartItems, setCartItems, deliveryDate, setDeliveryDate } = useContext(
    SettingsContext
  );
  const [loading, setLoading] = useState(false);

  const cartRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleCloseCart = (e: MouseEvent) => {
    const cartBody = cartRef.current;
    const backdrop = backdropRef.current;
    if (!cartBody || !cartBody.contains(e.target as Node)) {
      if (backdrop?.contains(e.target as Node)) cancel();
    }
  };

  const handleRemoveItemQuantity = (key: number) => {
    const item = cartItems.find(item => item.key === key);
    if (item) {
      if (item.quantity > 1) {
        setCartItems(
          cartItems.map(item => {
            if (item.key === key) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          })
        );
      }
    }
  };

  const handleAddItemQuantity = (key: number) => {
    const item = cartItems.find(item => item.key === key);
    if (item) {
      setCartItems(
        cartItems.map(item => {
          if (item.key === key) {
            return { ...item, quantity: item.quantity + 1 };
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

  const handleRemoveItem = (key: number) => {
    setCartItems(cartItems.filter(item => item.key !== key));
  };

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
    const order = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity
    }));

    const response = await createOrder({
      orderProducts: order,
      paymentStatus: "Not Paid (Website - Bank Transfer)",
      cost: total,
      deliveryDate: deliveryDate?.toISOString(),
      admin: "regalflowersnigeria@gmail.com",
      adminNotes: "test",
      amount: 0,
      anonymousClient: false,
      arrangementTime: "",
      client: {},
      business: "Regal Flowers",
      channel: "Regal Website",
      contactDepsArray: [],
      costBreakdown: "",
      deliveryMessage: "",
      deliveryNotePrinted: false,
      deliveryStatus: "Not Arranged",
      deliveryZone: "WEB",
      despatchFrom: "Unselected",
      driver: {},
      editingAdminsRevised: [],
      feedback: {},
      isClientRecipient: false,
      isDuplicatedOrder: false,
      lastDeliveryNotePrintedAdmin: "",
      lastDeliveryNotePrintedTime: "",
      lastDeliveryStatusAdmin: "",
      lastDeliveryStatusTime: "",
      lastMessagePrintedAdmin: "",
      lastMessagePrintedTime: "",
      lastPaymentStatusAdmin: "",
      lastPaymentStatusTime: "",
      line: "Unselected",
      messagePrinted: false,
      orderDetails: "",
      profit: "",
      purpose: "Unknown",
      recipient: {},
      recipientAddress: "",
      receivedByName: "",
      receivedByPhone: "",
      sendReminders: false,
      upsellProfit: 0,
      websiteOrderID: "",
      driverAlerted: false
    });

    if (response.data) {
      setDeliveryDate(
        response.data.deliveryDate ? dayjs(response.data?.deliveryDate) : null
      );
      router.push(`/checkout?orderId=${response.data.id}`);
      setCartItems([]);
    }

    setLoading(false);
  };

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
          <h3 className="sub-heading bold">My Cart ({cartItems.length})</h3>
          <img
            src="/icons/cancel-cart.svg"
            className="generic-icon medium clickable"
            alt="cancel"
            onClick={cancel}
          />
        </div>
        {
          <div className={styles["body"]}>
            {cartItems.length ? (
              <div className={styles["delivery-status"]}>
                <span>Delivery date</span>
                <span>{deliveryDate || "Not set yet"}</span>
                <span className="underline primary-color">Edit</span>
              </div>
            ) : (
              ""
            )}
            {cartItems.length ? (
              cartItems?.map(item => (
                <>
                  <div className={styles["cart-item"]}>
                    <img
                      src="/icons/delete-cart.svg"
                      alt="delete"
                      className="generic-icon large margin-top spaced clickable"
                      onClick={() => handleRemoveItem(item.key)}
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
                            ₦{item.price}
                          </p>
                          <div className="flex center-align spaced-lg">
                            <div
                              className={styles.minus}
                              onClick={() => handleRemoveItemQuantity(item.key)}
                            ></div>
                            <span className="small-text">{item.quantity}</span>
                            <div
                              className={styles.plus}
                              onClick={() => handleAddItemQuantity(item.key)}
                            ></div>
                          </div>
                        </div>
                        {item.size && <p>Size: {item.size}</p>}
                        {item.design && (
                          <p className="vertical-margin">
                            Design: {item.design}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ))
            ) : (
              <div className={styles["empty-cart"]}>Empty Cart</div>
            )}
            {cartItems.length ? (
              <>
                <div className="flex between center-align vertical-margin spaced">
                  <span className="small-text">Subtotal</span>
                  <strong className="small-text">₦{total}</strong>
                </div>
                <div className="flex between center-align margin-bottom spaced">
                  <span className="small-text">Total</span>
                  <strong className="small-text">₦{total}</strong>
                </div>
              </>
            ) : (
              ""
            )}
            <Button
              responsive
              className="margin-top spaced"
              onClick={handleCreateOrder}
              loading={loading}
              disabled={!cartItems.length}
            >
              Proceed to checkout (₦{total})
            </Button>
          </div>
        }
      </div>
    </div>
  );
};

export const CheckoutHeader: FunctionComponent = () => {
  // const [stage, setCurrentStage] = useState<number>(3);
  const { currentStage } = useContext(SettingsContext);

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

export default Layout;
