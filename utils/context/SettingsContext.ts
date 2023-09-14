import { Dayjs } from "dayjs";
import { createContext } from "react";
import { AppCurrency, CartItem, Settings, Stage } from "../types/Core";
import User from "../types/User";
import { Order } from "../types/Order";
import { ConfirmParams } from "../../components/layout/Layout";

export type NotifyType = "success" | "error" | "info";

export interface Breadcrumb {
  label: string;
  url: string;
}

export interface SettingsControls extends Settings {
  currency: AppCurrency;
  setCurrency: (currency: AppCurrency) => void;
  setCurrentStage: (stage: Stage) => void;
  deliveryDate: Dayjs | null;
  setDeliveryDate: (deliveryDate: Dayjs | null) => void;
  setCartItems: (cartItems: CartItem[]) => void;
  cartItems: CartItem[];
  notify: (type: NotifyType, message: any, duration?: number) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  setShouldShowCart: (shouldShowCart: boolean) => void;
  shouldShowCart: boolean;
  redirect: string;
  setRedirectUrl: (redirect: string) => void;
  setShouldShowAuthDropdown: (shouldShowAuthDropdown: boolean) => void;
  shouldShowAuthDropdown: boolean;
  orderId: string;
  setOrderId: (orderId: string) => void;
  order: Order | null;
  setOrder: (order: Order | null) => void;
  confirm: (confirmParams: ConfirmParams) => void;
  breadcrumb: Breadcrumb;
  setBreadcrumb: (breadcrumb: Breadcrumb) => void;
  orderLoading: boolean;
  setOrderLoading: (orderLoading: boolean) => void;
}

const SettingsContext = createContext<SettingsControls>({
  currency: { name: "NGN", conversionRate: 1 },
  allCurrencies: [],
  setCurrency: () => {},
  currentStage: 1,
  setCurrentStage: () => {},
  deliveryDate: null,
  setDeliveryDate: () => {},
  cartItems: [],
  setCartItems: () => {},
  notify: () => {},
  user: null,
  setUser: () => {},
  setShouldShowCart: () => {},
  shouldShowCart: false,
  redirect:
    "/product-category/birthday-flowers-anniversary-flowers-love-amp-romance-flowers-valentine-flowers-mothers-day-flowers",
  setRedirectUrl: () => {},
  setShouldShowAuthDropdown: () => {},
  shouldShowAuthDropdown: false,
  orderId: "",
  setOrderId: () => {},
  order: null,
  setOrder: () => {},
  confirm: () => {},
  breadcrumb: { label: "", url: "" },
  setBreadcrumb: () => {},
  orderLoading: false,
  setOrderLoading: () => {}
});

export default SettingsContext;
