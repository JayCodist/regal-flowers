import {
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import Link from "next/link";
import styles from "./Layout.module.scss";
import { AppCurrency, AppLink } from "../../utils/types/Core";
import { defaultCurrency } from "../../utils/constants";
import SettingsContext from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";
import Button from "../button/Button";

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
  const [showCart, setShowCart] = useState(false);

  const links: AppLink[] = [
    {
      url: "#",
      title: "Send To",
      children: []
    },
    {
      url: "/filters?selectedOccasion=Anniversary Flowers",
      title: "Occasions",
      children: []
    },
    {
      url: "#",
      title: "Shop By",
      children: []
    },
    {
      url: "#",
      title: "VIP Section",
      children: []
    },
    {
      url: "#",
      title: "Gifts",
      children: []
    },
    {
      url: "/faq",
      title: "FAQ",
      children: []
    }
  ];

  const currencyOptions: AppCurrency[] = [
    { ...defaultCurrency },
    { name: "USD", conversionRate: 415 },
    { name: "GBP", conversionRate: 523 }
  ];

  const { currency, setCurrency } = useContext(SettingsContext);

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
        <nav className={styles.nav}>
          {links.map(link => (
            <Link href={link.url} key={link.title}>
              <a>
                <strong className={styles.link}>{link.title}</strong>
              </a>
            </Link>
          ))}
        </nav>
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
              <button className="flex column center-align">
                <img
                  alt="user"
                  src="/icons/user.svg"
                  className={styles["control-icon"]}
                />
                <span>Account</span>
              </button>
            </div>
            <button
              className={[
                "flex",
                "column",
                "center-align",
                showCart && "primary-color"
              ].join(" ")}
              onClick={() => setShowCart(true)}
            >
              <img
                alt="cart"
                src="/icons/cart.svg"
                className={styles["control-icon"]}
              />
              <span>Cart (0)</span>
            </button>
            <button className="flex column center-align">
              <img
                alt="phone"
                src="/icons/phone.svg"
                className={styles["control-icon"]}
              />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </header>
      <CartContext visible={showCart} cancel={() => setShowCart(false)} />
    </>
  );
};

interface CartContextProps {
  visible: boolean;
  cancel: () => void;
}

const CartContext: FunctionComponent<CartContextProps> = props => {
  const { visible, cancel } = props;

  const cartRef = useRef<HTMLDivElement>(null);

  const handleCloseChart = (e: MouseEvent) => {
    const cartBody = cartRef.current;
    if (!cartBody || !cartBody.contains(e.target as Node)) {
      cancel();
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleCloseChart);
    }
    return () => {
      document.removeEventListener("mousedown", handleCloseChart);
    };
  });

  return (
    <div className={[styles.backdrop, visible && styles.active].join(" ")}>
      <div
        ref={cartRef}
        className={[styles["cart-context"], visible && styles.active].join(" ")}
      >
        <div className={styles["cart-header"]}>
          <h3 className="sub-heading bold">My Cart (5)</h3>
          <img
            src="/icons/cancel-cart.svg"
            className="generic-icon medium clickable"
            alt="cancel"
            onClick={cancel}
          />
        </div>
        <div className={styles["body"]}>
          <div className={styles["delivery-status"]}>
            <span>Delivery date</span>
            <span>June 10, 2021</span>
            <span className="underline primary-color">Edit</span>
          </div>
          <div className={styles["cart-item"]}>
            <img
              src="/icons/delete-cart.svg"
              alt="delete"
              className="generic-icon large margin-top spaced"
            />
            <div className="flex spaced align-center">
              <img
                src="/images/product-image/flower1.png"
                alt="flower"
                className={styles["product-image"]}
              />
              <div>
                <p>A Kiss of Rose</p>
                <p>
                  Single stem rose available in red, white, pink and yellow.
                </p>
                <div className="flex between center-align vertical-margin">
                  <p className="primary-color normal-text bold">₦36,000</p>
                  <div className="flex center-align spaced-lg">
                    <div className={styles.minus}></div>
                    <span className="small-text">4</span>
                    <div className={styles.plus}></div>
                  </div>
                </div>
                <p>Size: Extra Small</p>
                <p className="vertical-margin">Design: Wrapped Bouquet</p>
              </div>
            </div>
          </div>
          <div className="flex between center-align vertical-margin spaced">
            <span className="small-text">Subtotal</span>
            <strong className="small-text">₦36,000</strong>
          </div>
          <div className="flex between center-align margin-bottom spaced">
            <span className="small-text">Total</span>
            <strong className="small-text">₦136,000</strong>
          </div>
          <Button responsive className="margin-top spaced">
            Proceed to checkout (₦136,000)
          </Button>
        </div>
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

  console.log(currentStage);
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

export default Layout;
