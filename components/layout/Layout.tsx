import { FunctionComponent, ReactNode, useContext } from "react";
import Link from "next/link";
import styles from "./Layout.module.scss";
import { AppCurrency, AppLink } from "../../utils/types/Core";
import { defaultCurrency } from "../../utils/constants";
import SettingsContext from "../../utils/context/SettingsContext";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
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
      url: "/filters/occassions?selectedOccassion=love-birthdays-anniversary",
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
      <img
        alt="regal flowers logo"
        src="/icons/logo.png"
        className={styles.logo}
      />
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
          <button className="flex column spaced center-align">
            <img
              alt="user"
              src="/icons/user.svg"
              className={styles["control-icon"]}
            />
            <span>Account</span>
          </button>
          <button className="flex column spaced center-align">
            <img
              alt="cart"
              src="/icons/cart.svg"
              className={styles["control-icon"]}
            />
            <span>Cart (0)</span>
          </button>
          <button className="flex column spaced center-align">
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

export default Layout;
