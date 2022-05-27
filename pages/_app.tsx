import { FunctionComponent, useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/styles.scss";
import Layout from "../components/layout/Layout";
import SettingsContext, {
  SettingsControls
} from "../utils/context/SettingsContext";
import { AppCurrency, Settings } from "../utils/types/Core";
import { defaultCurrency } from "../utils/constants";

const defaultSettings: Settings = {
  currency: defaultCurrency
};

const App: FunctionComponent<AppProps> = props => {
  const { Component, pageProps } = props;
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const settingsControls: SettingsControls = {
    currency: settings.currency,
    setCurrency: (currency: AppCurrency) =>
      setSettings({ ...settings, currency })
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
