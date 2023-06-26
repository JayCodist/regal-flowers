import { Dayjs } from "dayjs";
import { createContext } from "react";
import {
  AppCurrency,
  CartItem,
  Redirect,
  Settings,
  Stage
} from "../types/Core";
import User from "../types/User";
import { Order } from "../types/Order";
import { ConfirmParams } from "../../components/layout/Layout";

export type NotifyType = "success" | "error" | "info";

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
  redirect: Redirect;
  setRedirect: (redirect: Redirect) => void;
  setShouldShowAuthDropdown: (shouldShowAuthDropdown: boolean) => void;
  shouldShowAuthDropdown: boolean;
  orderId: string;
  setOrderId: (orderId: string) => void;
  order: Order | null;
  setOrder: (order: Order | null) => void;
  confirm: (confirmParams: ConfirmParams) => void;
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
  redirect: {
    title: "Love, Birthdays & Anniversary",
    url:
      "/product-category/birthday-flowers-anniversary-flowers-love-amp-romance-flowers-valentine-flowers-mothers-day-flowers"
  },
  setRedirect: () => {},
  setShouldShowAuthDropdown: () => {},
  shouldShowAuthDropdown: false,
  orderId: "",
  setOrderId: () => {},
  order: null,
  setOrder: () => {},
  confirm: () => {}
});

export default SettingsContext;
