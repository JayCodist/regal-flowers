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
}
