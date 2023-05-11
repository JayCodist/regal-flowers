import { Option } from "../../components/select/Select";
import { AppCurrency } from "../types/Core";
import { CheckoutFormData } from "../types/Order";

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

export const adaptCheckOutFomData: (
  record: any
) => Partial<CheckoutFormData> = record => {
  const homeAddress = getAddress(record.recipientAddress);
  return {
    senderEmail: record.client.email,
    senderName: record.client.name,
    senderPhoneNumber: record.client.phone,
    senderCountryCode: record.client.phone.slice(0, 3),
    recipientName: record.recipient.name,
    recipientPhoneNumber: record.recipient.phone,
    recipientCountryCode: record.recipient.phone.slice(0, 3),
    recipientPhoneNumberAlt: record.recipient.phoneAlt,
    recipientCountryCodeAlt: record.recipient.phoneAlt.slice(0, 3),
    recipientHomeAddress: homeAddress,
    residenceType: getValueInParentheses(record.recipientAddress),
    deliveryMethod: homeAddress ? "delivery" : "pick-up",
    deliveryLocation: record.despatchLocation,
    deliveryDate: record.deliveryDate,
    message: record.deliveryMessage,
    purpose: record.purpose,
    additionalInfo: record.adminNotes,
    pickUpLocation: record.despatchLocation,
    shouldSaveAddress: record.shouldSaveAddress,
    freeAccount: record.shouldCreateAccount,
    shouldCreateAccount: record.shouldCreateAccount,
    zone: record.zone,
    state: record.state
  };
};
