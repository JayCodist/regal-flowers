import { business } from "../../constants";
import { AppCurrencyName, CartItem } from "../../types/Core";
import { Order, CheckoutFormData, PaymentName } from "../../types/Order";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";
import AppStorage, { AppStorageConstants } from "../storage-helpers";
import { getKeyMap } from "../type-helpers";

const adaptCheckoutStateRecord = (
  record: CheckoutFormData,
  fromBackend?: boolean
) => {
  if (!record) {
    return record;
  }

  const processedRecord: Record<string, any> = {
    shouldCreateAccount: record.freeAccount,
    shouldSaveAddress: record.shouldSaveAddress,
    deliveryLocation: record.deliveryLocation,
    orderData: {
      deliveryInstruction: record.deliveryInstruction,
      deliveryDate: record.deliveryDate?.format("YYYY-MM-DD"),
      adminNotes: `${record.additionalInfo}`,
      deliveryMessage: record.message,
      despatchLocation: record.pickUpLocation,
      purpose: record.purpose,
      recipient:
        record.deliveryMethod === "delivery"
          ? {
              name: record.recipientName,
              phone: record.recipientCountryCode + record.recipientPhoneNumber,
              phoneCountryCode: record.recipientCountryCode,
              phoneAlt: record.recipientPhoneNumberAlt
                ? record.recipientCountryCodeAlt +
                  record.recipientPhoneNumberAlt
                : "",
              altPhoneCountryCode:
                record.recipientPhoneNumberAlt &&
                record.recipientCountryCodeAlt,
              address: record.recipientHomeAddress,
              state: record.state,
              residenceType: record.residenceType,
              method: record.deliveryMethod
            }
          : {
              name: "",
              phone: "",
              phoneAlt: "",
              address: "",
              state: "",
              residenceType: "",
              method: record.deliveryMethod,
              phoneCountryCode: "",
              altPhoneCountryCode: ""
            },
      deliveryDetails:
        record.deliveryMethod === "delivery"
          ? {
              recidenceType: record.residenceType,
              recipientAddress: record.recipientHomeAddress,
              recipientName: record.recipientName,
              recipientPhone:
                record.recipientCountryCode + record.recipientPhoneNumber,
              recipientPhoneCountryCode: record.recipientCountryCode,
              recipientAltPhone: record.recipientPhoneNumberAlt
                ? record.recipientCountryCodeAlt +
                  record.recipientPhoneNumberAlt
                : "",
              recipientAltPhoneCountryCode:
                record.recipientPhoneNumberAlt &&
                record.recipientCountryCodeAlt,
              state: record.state,
              zone: record.zone
            }
          : {
              recidenceType: "",
              recipientAddress: "",
              recipientName: "",
              recipientPhone: "",
              recipientAltPhone: "",
              state: "",
              zone: "",
              recipientPhoneCountryCode: ""
            }
    },
    userData: {
      name: record.senderName,
      email: record.senderEmail,
      phone: record.senderCountryCode + record.senderPhoneNumber,
      password: record.senderPassword || undefined,
      phoneCountryCode: record.senderCountryCode
    }
  };

  const keyMap: Record<string, string> = {
    ...getKeyMap(processedRecord)
  };

  const adaptedRecord = Object.entries(keyMap).reduce((map, arr) => {
    const value: any = processedRecord[fromBackend ? arr[1] : arr[0]];

    return value === undefined || value === ""
      ? map
      : {
          ...map,
          [fromBackend ? arr[0] : arr[1]]: value
        };
  }, {});

  return adaptedRecord;
};

export const getOrder: (
  id: string
) => Promise<RequestResponse<Order>> = async id => {
  try {
    const response = await restAPIInstance.get(
      `/v1/firebase/order/${id}?business=${business}`
    );
    return {
      error: false,
      data: response.data as Order
    };
  } catch (err) {
    if ((err as any).status === 404) {
      AppStorage.remove(AppStorageConstants.ORDER_ID);
      AppStorage.remove(AppStorageConstants.CART_ITEMS);
    }
    return {
      error: true,
      message: (err as Error).message,
      data: null,
      status: (err as any).status
    };
  }
};

export const createOrder: (payload: {
  cartItems: CartItem[];
  deliveryDate: string;
  currency: AppCurrencyName;
}) => Promise<RequestResponse<Order>> = async ({
  cartItems,
  deliveryDate,
  currency
}) => {
  try {
    const response = await restAPIInstance.post(`/v1/firebase/order/create`, {
      deliveryDate,
      cartItems: cartItems.map(item => ({
        key: item.key,
        design: item.design?.name || "",
        size: item.size || "",
        quantity: item.quantity,
        image: item.image
      })),
      currency,
      business
    });
    AppStorage.save(AppStorageConstants.ORDER_ID, response.data.id);
    return {
      error: false,
      data: response.data as Order
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const updateOrder: (payload: {
  cartItems: CartItem[] | null;
  deliveryDate?: string;
  id?: string;
  currency?: AppCurrencyName;
}) => Promise<RequestResponse<Order>> = async ({
  cartItems,
  deliveryDate,
  id,
  currency
}) => {
  try {
    const response = await restAPIInstance.put(`/v1/firebase/order/${id}`, {
      deliveryDate,
      cartItems: cartItems
        ? cartItems.map(item => ({
            key: item.key,
            design: item.design?.name || "",
            size: item.size || "",
            quantity: item.quantity,
            image: item.image
          }))
        : null,
      currency,
      business
    });
    return {
      error: false,
      data: response.data as Order
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const updateCheckoutState: (
  id: string,
  formData: CheckoutFormData
) => Promise<RequestResponse<Order>> = async (id, formData) => {
  try {
    const response = await restAPIInstance.put(
      `/v1/firebase/order/checkout-order/${id}`,
      {
        ...adaptCheckoutStateRecord(formData),
        currency: formData.currency,
        business
      }
    );
    return {
      error: false,
      data: response.data as Order
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const saveSenderInfo: (
  id: string,
  record: {
    userData: {
      name: string;
      email: string;
      phone: string;
      phoneCountryCode: string;
    };
    deliveryDate: string;
  }
) => Promise<RequestResponse<Order>> = async (id, record) => {
  try {
    const response = await restAPIInstance.put(
      `/v1/firebase/order/save-sender-info/${id}`,
      record
    );
    return {
      error: false,
      data: response.data as Order
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const updatePaymentMethodDetails: (payload: {
  currency: AppCurrencyName;
  orderId: string;
  paymentMethod: PaymentName;
}) => Promise<RequestResponse<boolean>> = async ({
  orderId,
  currency,
  paymentMethod
}) => {
  try {
    const response = await restAPIInstance.put(
      `/v1/firebase/order/update-payment-details/${orderId}`,
      {
        currency,
        paymentMethod
      }
    );
    return {
      error: !response.data,
      message: response.message,
      data: response.data
    };
  } catch (err) {
    console.error("Unable to update payment method ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
