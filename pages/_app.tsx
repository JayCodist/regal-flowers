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
  Breadcrumb,
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
import {
  currencyOptions,
  defaultBreadcrumb,
  defaultCurrency
} from "../utils/constants";
import dayjs, { Dayjs } from "dayjs";
import User from "../utils/types/User";
import AppStorage, {
  AppStorageConstants
} from "../utils/helpers/storage-helpers";
import { performHandshake } from "../utils/helpers/data/core";
import { getDefaultCurrency } from "../utils/helpers/type-conversions";
import { Order } from "../utils/types/Order";
import ProgressBar from "../components/progress-bar/ProgressBar";

const defaultSettings: Settings = {
  currency: defaultCurrency,
  allCurrencies: currencyOptions,
  currentStage: 1,
  deliveryDate: null,
  cartItems: [],
  shouldShowCart: false,
  redirect:
    "/product-category/birthday-flowers-anniversary-flowers-love-amp-romance-flowers-valentine-flowers-mothers-day-flowers",
  shouldShowAuthDropdown: false,
  orderId: "",
  order: null,
  searchText: ""
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>(defaultBreadcrumb);
  const [orderLoading, setOrderLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<Stage>(1);
  const [searchText, setSearchText] = useState("");

  const initializeAppConfig = async () => {
    const savedCartItems = AppStorage.get<CartItem[]>(
      AppStorageConstants.CART_ITEMS
    );
    const savedDeliveryDate = AppStorage.get<Dayjs>(
      AppStorageConstants.DELIVERY_DATE
    );

    const { defaultCurrencyName, fromStorage } = getDefaultCurrency();
    const defaultCurrency =
      settings.allCurrencies.find(
        currency => currency.name === defaultCurrencyName
      ) || defaultSettings.currency;

    if (defaultCurrencyName !== "NGN" && !fromStorage) {
      notify(
        "info",
        `Based on your location, the site has been set to ${defaultCurrencyName} (${defaultCurrency.sign}) to enable foreign Credit/Debit Cards and Paypal`,
        4000
      );
    }

    setSettings({
      ...settings,
      currency: defaultCurrency
    });
    const savedOrderId = AppStorage.get<string>(AppStorageConstants.ORDER_ID);

    setOrderId(savedOrderId || "");
    setDeliveryDate(savedDeliveryDate ? dayjs(savedDeliveryDate) : null);
    setCartItems(savedCartItems || []);

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
      setSettings({
        ...settings,
        currency: {
          ...defaultCurrency,
          conversionRate:
            currencyValueMap[defaultCurrency.name] ||
            defaultCurrency.conversionRate
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
    currentStage,
    setCurrentStage,
    deliveryDate,
    setDeliveryDate: (date: Dayjs | null) => {
      AppStorage.save(AppStorageConstants.DELIVERY_DATE, date);
      setDeliveryDate(date);
    },
    cartItems,
    setCartItems: (items: CartItem[]) => {
      setCartItems(items);
      AppStorage.save(AppStorageConstants.CART_ITEMS, items);
    },
    allCurrencies: settings.allCurrencies,
    shouldShowCart,
    setShouldShowCart,
    notify,
    user,
    setUser,
    redirect: settings.redirect,
    setRedirectUrl: (redirect: string) => {
      setSettings({ ...settings, redirect });
    },
    shouldShowAuthDropdown,
    setShouldShowAuthDropdown,
    orderId,
    setOrderId,
    order,
    setOrder,
    confirm,
    breadcrumb,
    setBreadcrumb,
    orderLoading,
    setOrderLoading,
    searchText,
    setSearchText
  };

  const headTags = (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Regal Flowers</title>
    </Head>
  );

  return (
    <SettingsContext.Provider value={settingsControls}>
      <ProgressBar />
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
