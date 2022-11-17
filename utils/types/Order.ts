import { ReactNode } from "react";
import { Addon } from "./AddonGroup";

export interface Order {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  details: string;
  addons: Addon[];
  size: string;
  design: string;
}

export type PaymentName = "paystack" | "googlePay" | "payPal" | "bankTransfer";

export interface PaymentMethod {
  title: string;
  paymentName: PaymentName;
  info: string;
  icon: ReactNode;
  other?: { icon: ReactNode }[];
}
