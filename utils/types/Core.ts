import { ReactNode } from "react";
import { Dayjs } from "dayjs";

export interface AppLink {
  url: string;
  title: string;
  children: AppLink[];
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
