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

function removeCountryCode(phoneNumber: string, countryCode: string) {
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
    state: record.deliveryDetails.state
  };
};
