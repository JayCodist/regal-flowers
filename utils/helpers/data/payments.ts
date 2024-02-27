import { business } from "../../constants";
import { AppCurrencyName } from "../../types/Core";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const verifyPaystackPayment: (
  paymentRef: string
) => Promise<RequestResponse<boolean>> = async paymentRef => {
  try {
    const response = await restAPIInstance.post(
      `/v1/payments/paystack/verify?ref=${paymentRef}&business=${business}`
    );
    return {
      error: !response.data,
      message: response.message,
      data: response.data,
      status: response.status
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
      `/v1/payments/monnify/verify?ref=${paymentRef}&business=${business}`
    );
    return {
      error: !response.data,
      message: response.message,
      data: response.data,
      status: response.status
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
  paymentRef: string,
  orderId: string
) => Promise<RequestResponse<boolean>> = async (paymentRef, orderId) => {
  try {
    const response = await restAPIInstance.post(
      `/v1/payments/paypal/verify?ref=${paymentRef}&business=${business}&orderId=${orderId}`
    );
    return {
      error: !response.data,
      message: response.message,
      data: response.data,
      status: response.status
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

export const manualTransferPayment: (payload: {
  amount: number;
  accountName: string;
  referenceNumber: string;
  currency: AppCurrencyName;
  orderId: string;
}) => Promise<RequestResponse<boolean>> = async ({
  orderId,
  amount,
  accountName,
  currency,
  referenceNumber
}) => {
  try {
    const response = await restAPIInstance.post(
      `/v1/payments/manual-transfer/${orderId}`,
      {
        amount,
        accountName,
        referenceNumber,
        currency,
        business
      }
    );
    return {
      error: !response.data,
      message: response.message,
      data: response.data,
      status: response.status
    };
  } catch (err) {
    console.error("Unable to send Transfer Details ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
