import { FunctionComponent, useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/styles.scss";
import Layout from "../components/layout/Layout";
import SettingsContext, {
  SettingsControls
} from "../utils/context/SettingsContext";
import { AppCurrency, CartItem, Settings, Stage } from "../utils/types/Core";
import { defaultCurrency } from "../utils/constants";
import { Dayjs } from "dayjs";

const defaultSettings: Settings = {
  currency: defaultCurrency,
  currentStage: 1,
  deliveryDate: null,
  cartItems: []
};

const App: FunctionComponent<AppProps> = props => {
  const { Component, pageProps } = props;
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const settingsControls: SettingsControls = {
    currency: settings.currency,
    setCurrency: (currency: AppCurrency) =>
      setSettings({ ...settings, currency }),
    currentStage: settings.currentStage,
    setCurrentStage: (currentStage: Stage) =>
      setSettings({ ...settings, currentStage }),
    deliveryDate: settings.deliveryDate,
    setDeliveryDate: (deliveryDate: Dayjs | null) =>
      setSettings({ ...settings, deliveryDate }),
    cartItems: settings.cartItems,
    setCartItems: (cartItems: CartItem[]) => {
      setSettings({ ...settings, cartItems });
    }
  };

  const headTags = (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Regal Flowers</title>
    </Head>
  );

  return (
    <SettingsContext.Provider value={settingsControls}>
      <div className="app-wrapper">
        {headTags}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </SettingsContext.Provider>
  );
};

export default App;
