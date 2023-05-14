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
    recipientName: record.deliveryDetails.recipientName,
    recipientPhoneNumber: record.deliveryDetails.recipientPhone,
    recipientPhoneNumberAlt: record.deliveryDetails.recipientAltPhone,
    // recipientCountryCodeAlt: record.deliveryDetails.phoneAlt,
    recipientHomeAddress: record.deliveryDetails.recipientAddress,
    residenceType: getValueInParentheses(record.recipientAddress),
    deliveryMethod: homeAddress ? "delivery" : "pick-up",
    deliveryLocation: record.despatchLocation,
    deliveryDate: record.deliveryDate,
    message: record.deliveryMessage,
    purpose: record.purpose,
    additionalInfo: record.adminNotes,
    pickUpLocation: record.despatchLocation,
    zone: record.zone,
    state: record.state
  };
};
