import { Option } from "../../components/select/Select";
import { AppCurrency, AppCurrencyName } from "../types/Core";
import AppStorage, { AppStorageConstants } from "./storage-helpers";

export const getOptionsFromArray: (
  strArray: string[] | number[]
) => Option[] = strArray => {
  return strArray.map(str => ({ label: str, value: str }));
};

export const getPriceDisplay: (
  price: number,
  currency: AppCurrency
) => string = (price, currency) => {
  return `${currency.sign || ""}${Math.round(
    price / currency.conversionRate
  ).toLocaleString()}`;
};

export const getDefaultCurrency: () => {
  defaultCurrencyName: AppCurrencyName;
  fromStorage: boolean;
} = () => {
  const savedCurrency = AppStorage.get<AppCurrency>(
    AppStorageConstants.SAVED_CURRENCY
  );
  if (savedCurrency) {
    return { defaultCurrencyName: savedCurrency.name, fromStorage: true };
  }
  const timezoneCurrencyMap: Record<string, AppCurrencyName> = {
    GB: "GBP",
    "GB-Eire": "GBP",
    "Europe/Belfast": "GBP",
    "Europe/London": "GBP",
    "Africa/Lagos": "NGN"
  };
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    defaultCurrencyName: timezoneCurrencyMap[timezone] || "USD",
    fromStorage: false
  };
};
