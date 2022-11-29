import { Dayjs } from "dayjs";
import { ReactNode } from "react";
import { ProductImage } from "./Product";

export interface AppLink {
  url: string | { pathname: string; query: Record<string, string | number> };
  title: string;
  children: AppLink[];
  subtitle?: string;
}

export interface AppCurrency {
  name: string;
  conversionRate: number;
  sign?: string;
}

export interface Settings {
  currency: AppCurrency;
  currentStage: Stage;
  deliveryDate: Dayjs | null;
  cartItems: CartItem[];
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

export interface CartItem {
  key: number;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  image: ProductImage;
  size?: string;
  design?: string;
}
