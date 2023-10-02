import { Option } from "../../components/select/Select";
import { AppCurrency, AppCurrencyName } from "../types/Core";
import AppStorage, { AppStorageConstants } from "./storage-helpers";
import { CheckoutFormData } from "../types/Order";
import { currencyOptions } from "../constants";

export const getOptionsFromArray: (
  strArray: string[] | number[]
) => Option[] = strArray => {
  return strArray.map(str => ({ label: str, value: str }));
};

export const getPriceDisplay: (
  price: number,
  currency: AppCurrency
) => string = (price, currency) => {
  return `${currency.sign || ""}${Math.ceil(
    price / currency.conversionRate
  ).toLocaleString()}`;
};

export const getNumber = (str: string | number) =>
  Number(String(str).replace(/[^\d.]/g, "")) || 0;

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
  const defaultCurrencyName = timezoneCurrencyMap[timezone] || "USD"
  const savedCurrencyObj = currencyOptions.find(currencyOption => currencyOption.name === defaultCurrencyName)
  AppStorage.save(AppStorageConstants.SAVED_CURRENCY, savedCurrencyObj)
  return {
    defaultCurrencyName,
    fromStorage: false
  };
};

export function getValueInParentheses(str: string) {
  const startIndex = str.indexOf("(");
  const endIndex = str.indexOf(")");

  return str.slice(startIndex + 1, endIndex);
}

export function getAddress(str: string) {
  const index = str.indexOf(")");
  if (index === -1) {
    return str;
  } else {
    return str.substring(index + 1).trim();
  }
}

export function removeCountryCode(phoneNumber = "", countryCode = "") {
  if (phoneNumber.startsWith(countryCode)) {
    phoneNumber = phoneNumber.slice(countryCode.length);
  }

  return phoneNumber;
}

export const adaptCheckOutFomData: (
  record: any
) => Partial<CheckoutFormData> = record => {
  const homeAddress = getAddress(record.recipientAddress);
  return {
    senderEmail: record.client.email,
    senderName: record.client.name,
    senderPhoneNumber: removeCountryCode(
      record.client.phone,
      record.client.phoneCountryCode
    ),
    senderCountryCode: record.client.phoneCountryCode || "+234",
    recipientName: record.deliveryDetails.recipientName,
    recipientPhoneNumber: removeCountryCode(
      record.deliveryDetails.recipientPhone,
      record.deliveryDetails.recipientPhoneCountryCode
    ),
    recipientCountryCode:
      record.deliveryDetails.recipientPhoneCountryCode || "+234",
    recipientPhoneNumberAlt: removeCountryCode(
      record.deliveryDetails.recipientAltPhone,
      record.deliveryDetails.recipientAltPhoneCountryCode
    ),
    recipientCountryCodeAlt:
      record.deliveryDetails.recipientAltPhoneCountryCode || "+234",
    recipientHomeAddress: record.deliveryDetails.recipientAddress,
    residenceType: getValueInParentheses(record.recipientAddress),
    deliveryMethod: homeAddress ? "delivery" : "pick-up",
    deliveryDate: record.deliveryDate,
    message: record.deliveryMessage,
    purpose: record.purpose,
    additionalInfo: record.adminNotes,
    pickUpLocation: record.despatchLocation,
    zone: record.deliveryDetails.zone,
    state: record.deliveryDetails.state,
    deliveryInstruction: record.deliveryInstruction
  };
};
