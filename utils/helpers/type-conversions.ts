import { Option } from "../../components/select/Select";
import { AppCurrency } from "../types/Core";

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
