import { FunctionComponent, useEffect, useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/styles.scss";
import Layout, {
  ConfirmModal,
  ConfirmParams,
  Toaster
} from "../components/layout/Layout";
import SettingsContext, {
  NotifyType,
  SettingsControls
} from "../utils/context/SettingsContext";
import {
  AppCurrency,
  AppCurrencyName,
  CartItem,
  Settings,
  Stage
} from "../utils/types/Core";
import { currencyOptions, defaultCurrency } from "../utils/constants";
import { Dayjs } from "dayjs";
import User from "../utils/types/User";
import AppStorage, {
  AppStorageConstants
} from "../utils/helpers/storage-helpers";
import { performHandshake } from "../utils/helpers/data/core";
import { Order } from "../utils/types/Order";

const defaultSettings: Settings = {
  currency: defaultCurrency,
  allCurrencies: currencyOptions,
  currentStage: 1,
  deliveryDate: null,
  cartItems: [],
  shouldShowCart: false,
  redirectUrl:
    "/product-category/birthday-flowers-anniversary-flowers-love-amp-romance-flowers-valentine-flowers-mothers-day-flowers",
  shouldShowAuthDropdown: false,
  orderId: "",
  order: null
};

let toasterTimer: ReturnType<typeof setTimeout>;
const toasterDuration = {
  success: 3000,
  info: 4000,
  error: 5000
};

const defaultConfirmParams = {
  body: "",
  cancelText: "",
  okText: "",
  onCancel: () => {},
  onOk: () => {},
  title: ""
};

const App: FunctionComponent<AppProps> = props => {
  const { Component, pageProps } = props;
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterParams, setToasterParams] = useState<{
    message?: string;
    type?: NotifyType;
  }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmParams, setConfirmParams] = useState<ConfirmParams>(
    defaultConfirmParams
  );
  const [user, setUser] = useState<User | null>(null);
  const [shouldShowCart, setShouldShowCart] = useState(false);
  const [shouldShowAuthDropdown, setShouldShowAuthDropdown] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<null | Dayjs>(null);
  const [orderId, setOrderId] = useState("");

  const initializeAppConfig = async () => {
    const savedCurrency = AppStorage.get<AppCurrency>(
      AppStorageConstants.SAVED_CURRENCY
    );
    const savedOrderId = AppStorage.get<string>(AppStorageConstants.ORDER_ID);

    setSettings({
      ...settings,
      currency: savedCurrency || defaultSettings.currency
    });
    setOrderId(savedOrderId || "");
    const { error, data } = await performHandshake();
    if (error || !data) {
      // Fail quietly and continue using the set constant values
    } else {
      setUser(data.user || null);

      AppStorage.save(AppStorageConstants.USER_DATA, data.user);

      const currencyValueMap: Partial<Record<AppCurrencyName, number>> =
        data.currencies.reduce(
          (map, currency) => ({
            ...map,
            [currency.name]: currency.conversionRate
          }),
          {}
        ) || {};

      const currentCurrency = savedCurrency || settings.currency;
      setSettings({
        ...settings,
        currency: {
          ...currentCurrency,
          conversionRate:
            currencyValueMap[currentCurrency.name] ||
            currentCurrency.conversionRate
        },
        allCurrencies: settings.allCurrencies.map(currency => ({
          ...currency,
          conversionRate:
            currencyValueMap[currency.name] || currency.conversionRate
        }))
      });
    }
  };

  useEffect(() => {
    initializeAppConfig();

    const savedUser = AppStorage.get<User>(AppStorageConstants.USER_DATA);
    setUser(
      savedUser
        ? { ...savedUser, recipients: savedUser.recipients || [] }
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notify = (type: NotifyType, message: string, duration?: number) => {
    setShowToaster(false);
    clearTimeout(toasterTimer);

    const displayToaster = () => {
      setToasterParams({ message, type });
      setShowToaster(true);

      toasterTimer = setTimeout(() => {
        setShowToaster(false);
      }, duration || toasterDuration[type]);
    };

    setTimeout(() => displayToaster(), 300);
  };

  const dismissToaster = () => {
    setShowToaster(false);
  };

  const confirm = (params: ConfirmParams) => {
    setConfirmParams(params);
    setShowConfirm(true);
  };

  const dismissConfirm = () => {
    setShowConfirm(false);
    setConfirmParams(defaultConfirmParams);
  };

  const settingsControls: SettingsControls = {
    currency: settings.currency,
    setCurrency: (currency: AppCurrency) => {
      setSettings({ ...settings, currency });
      AppStorage.save(AppStorageConstants.SAVED_CURRENCY, currency);
    },
    currentStage: settings.currentStage,
    setCurrentStage: (currentStage: Stage) =>
      setSettings({ ...settings, currentStage }),
    deliveryDate,
    setDeliveryDate,
    cartItems: settings.cartItems,
    setCartItems: (cartItems: CartItem[]) => {
      setSettings({ ...settings, cartItems });
      // AppStorage.save(AppStorageConstants.CART_ITEMS, cartItems);
      if (cartItems.length === 0) {
        AppStorage.remove(AppStorageConstants.ORDER_ID);
      }
    },
    allCurrencies: settings.allCurrencies,
    shouldShowCart,
    setShouldShowCart,
    notify,
    user,
    setUser,
    redirectUrl: settings.redirectUrl,
    setRedirectUrl: (redirectUrl: string) => {
      setSettings({ ...settings, redirectUrl });
    },
    shouldShowAuthDropdown,
    setShouldShowAuthDropdown,
    orderId,
    setOrderId,
    order,
    setOrder,
    confirm
  };

  const headTags = (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Regal Flowers</title>
    </Head>
  );

  return (
    <SettingsContext.Provider value={settingsControls}>
      <div suppressHydrationWarning className="app-wrapper">
        {headTags}
        <Layout>
          <Component {...pageProps} />
          <ConfirmModal
            visible={showConfirm}
            confirmParams={confirmParams}
            cancel={dismissConfirm}
          />
          <Toaster
            visible={showToaster}
            toasterParams={toasterParams}
            cancel={dismissToaster}
          />
        </Layout>
      </div>
    </SettingsContext.Provider>
  );
};

export default App;
