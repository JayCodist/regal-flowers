import { OrderCreate, Order, CheckoutFormData } from "../../types/Order";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";
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
    orderData: {
      deliveryDate: record.deliveryDate,
      adminNotes: `TEST ${record.additionalInfo}`,
      deliveryMessage: record.message,
      purpose: record.purpose,
      client: {
        name: record.senderName,
        email: record.senderEmail,
        phone: record.senderPhoneNumber,
        password: record.senderPassword
      },
      recipient: {
        name: record.recipientName,
        phone: record.recipientPhoneNumber,
        phoneAlt: record.recipientPhoneNumberAlt,
        address: record.recipientHomeAddress,
        state: record.state,
        residenceType: record.residenceType,
        method: record.deliveryMethod
      }
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
    const response = await restAPIInstance.get(`/v1/firebase/order/${id}`);
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

export const createOrder: (
  order: OrderCreate
) => Promise<RequestResponse<Order>> = async order => {
  try {
    const response = await restAPIInstance.post(
      `/v1/firebase/order/create`,
      order
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

export const updateCheckoutState: (
  id: string,
  formData: CheckoutFormData
) => Promise<RequestResponse<Order>> = async (id, formData) => {
  try {
    const response = await restAPIInstance.put(
      `/v1/firebase/order/checkout-order/${id}`,
      adaptCheckoutStateRecord(formData)
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
