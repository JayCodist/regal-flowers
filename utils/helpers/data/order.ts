import { OrderCreate, Order, OrderUpdate } from "../../types/Order";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";
import { getKeyMap } from "../type-helpers";

const adaptUpdateOrderRecord = (record: any, fromBackend?: boolean) => {
  if (!record) {
    return record;
  }

  const processedRecord: Record<string, any> = {
    deliveryState: record.deliveryState,
    pickUpLocation: record.pickUpLocation,
    deliveryDate: record.deliveryDate,
    additionalInfo: record.additionalInfo,
    deliveryMessage: record.message,
    purpose: record.purpose,
    pickUpState: record.pickUpState,
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
      email: record.recipientEmail,
      address: [...record.recipientHomeAddress]
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

export const updateOrder: (
  id: string,
  order: OrderUpdate
) => Promise<RequestResponse<Order>> = async (id, order) => {
  const data = adaptUpdateOrderRecord(order);
  try {
    const response = await restAPIInstance.put(
      `/v1/firebase/order/update/${id}`,
      data
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
