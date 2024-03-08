import { AppCurrency } from "../../types/Core";
import RequestResponse from "../../types/RequestResponse";
import User from "../../types/User";
import { restAPIInstance } from "../rest-api-config";
import { business } from "../../constants";

export const performHandshake: () => Promise<
  RequestResponse<{ currencies: AppCurrency[]; user: User | null }>
> = async () => {
  try {
    const response = await restAPIInstance.get(
      `/v1/regal/handshake?business=${business}`
    );
    return {
      error: false,
      data: response.data
    };
  } catch (err) {
    console.error("Unable to perform handshake: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const subscribeToNewsletter: (
  email: string
) => Promise<RequestResponse<null>> = async email => {
  try {
    await restAPIInstance.post(
      `/v1/regal/subscribe?business=${business}&email=${email}`,
      {}
    );
    return {
      error: false,
      data: null
    };
  } catch (err) {
    console.error("Unable to subscribe email: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
