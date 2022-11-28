import { Dayjs } from "dayjs";
import { createContext } from "react";
import { AppCurrency, CartItem, Settings, Stage } from "../types/Core";
import User from "../types/User";

export type NotifyType = "success" | "error" | "info";

export interface SettingsControls extends Settings {
  currency: AppCurrency;
  setCurrency: (currency: AppCurrency) => void;
  setCurrentStage: (stage: Stage) => void;
  deliveryDate: Dayjs | null;
  setDeliveryDate: (deliveryDate: Dayjs | null) => void;
  setCartItems: (cartItems: CartItem[]) => void;
  cartItems: CartItem[];
  notify: (type: NotifyType, message: string, duration?: number) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const SettingsContext = createContext<SettingsControls>({
  currency: { name: "NGN", conversionRate: 1 },
  setCurrency: () => {},
  currentStage: 1,
  setCurrentStage: () => {},
  deliveryDate: null,
  setDeliveryDate: () => {},
  cartItems: [],
  setCartItems: () => {},
  notify: () => {},
  user: null,
  setUser: () => {}
});

export default SettingsContext;
