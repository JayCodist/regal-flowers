import { Dayjs } from "dayjs";
import { ReactNode } from "react";
import { DesignOptionName, ProductImage } from "./Product";

export interface AppLink {
  url: string;
  title: string;
  children: AppLink[];
  subtitle?: string;
}

export type AppCurrencyName = "NGN" | "GBP" | "USD";

export interface AppCurrency {
  name: AppCurrencyName;
  conversionRate: number;
  sign?: string;
}

export interface Settings {
  currency: AppCurrency;
  currentStage: Stage;
  deliveryDate: Dayjs | null;
  cartItems: CartItem[];
  allCurrencies: AppCurrency[];
  shouldShowCart: boolean;
  redirectUrl: string;
  shouldShowAuthDropdown: boolean;
  orderId: string;
}

export enum Stage {
  "delivery" = 1,
  "payment",
  "done"
}

export interface PaymentMethod {
  name: string;
  info: string;
  icon: ReactNode;
  other?: { icon: ReactNode }[];
}

export interface Design {
  quantity: number;
  name: DesignOptionName;
  price: number;
  title: string;
}

export interface CartItem {
  key: number;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  image: ProductImage;
  size?: string;
  design?: Design | null;
  addonsTotal?: number;
  cartId: string;
}

export type OrderItem = Omit<CartItem, "cartId" | "amount"> & {
  amount: number;
};
