import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const verifyPaystackPayment: (
  paymentRef: string
) => Promise<RequestResponse<boolean>> = async paymentRef => {
  try {
    const response = await restAPIInstance.post(
      `/v1/payments/paystack/verify?ref=${paymentRef}`
    );
    return {
      error: !response.data,
      message: response.message,
      data: response.data
    };
  } catch (err) {
    console.error("Unable to verify paystack payment: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const verifyMonnifyPayment: (
  paymentRef: string
) => Promise<RequestResponse<boolean>> = async paymentRef => {
  try {
    const response = await restAPIInstance.post(
      `/v1/payments/monnify/verify?ref=${paymentRef}`
    );
    return {
      error: !response.data,
      message: response.message,
      data: response.data
    };
  } catch (err) {
    console.error("Unable to verify monnify payment: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const verifyPaypalPayment: (
  paymentRef: string
) => Promise<RequestResponse<boolean>> = async paymentRef => {
  try {
    const response = await restAPIInstance.post(
      `/v1/payments/paypal/verify?ref=${paymentRef}`
    );
    return {
      error: !response.data,
      message: response.message,
      data: response.data
    };
  } catch (err) {
    console.error("Unable to verify paypal payment: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
