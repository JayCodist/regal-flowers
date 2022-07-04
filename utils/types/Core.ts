import { Dayjs } from "dayjs";

export interface AppLink {
  url: string;
  title: string;
  children: AppLink[];
}

export interface AppCurrency {
  name: string;
  conversionRate: number;
}

export interface Settings {
  currency: AppCurrency;
  stage: Stage;
  deliveryDate: Dayjs | null;
}

export interface Stage {
  name: "delivery" | "payment" | "done";
  stage: number;
}
