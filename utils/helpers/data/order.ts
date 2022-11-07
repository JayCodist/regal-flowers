import { CreateOrder, Order } from "../../types/Order";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

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
  order: CreateOrder
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
  order: CreateOrder
) => Promise<RequestResponse<Order>> = async (id, order) => {
  try {
    const response = await restAPIInstance.put(
      `/v1/firebase/order/update/${id}`,
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
