import {
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import Link from "next/link";
import styles from "./Layout.module.scss";
import { AppCurrency, AppLink, Stage } from "../../utils/types/Core";
import { defaultCurrency } from "../../utils/constants";
import SettingsContext from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [pathName, setPathName] = useState("");
  const { pathname } = useRouter();

  useEffect(() => {
    setPathName(pathname.split("/")[1]);
  }, [pathname]);

  return (
    <>
      {pathName === "checkout" ? <CheckoutHeader /> : <Header />}
      <main className={styles.main}>{children}</main>
    </>
  );
};

const Header: FunctionComponent = () => {
  const links: AppLink[] = [
    {
      url: "#",
      title: "Send To",
      children: []
    },
    {
      url: "/filters/occasions?selectedOccasion=love-birthdays-anniversary",
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
          <button className="flex column center-align">
            <img
              alt="user"
              src="/icons/user.svg"
              className={styles["control-icon"]}
            />
            <span>Account</span>
          </button>
          <button className="flex column center-align">
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
  );
};

export const CheckoutHeader: FunctionComponent = () => {
  // const [stage, setStage] = useState<number>(3);
  const { stage } = useContext(SettingsContext);

  const stages: Stage[] = [
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
                stage.stage === _stage.stage && styles.active
              ].join(" ")}
            >
              {_stage.stage > 1 && (
                <hr
                  className={[
                    styles["progress-bar"],
                    stage.stage >= _stage.stage && styles.active
                  ].join(" ")}
                />
              )}
              <span
                className={[
                  styles.circle,
                  stage.stage > _stage.stage && styles.completed,
                  stage.stage === _stage.stage && styles.active
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
                stage.stage === _stage.stage && styles.active,
                stage.stage > _stage.stage && styles.completed
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
