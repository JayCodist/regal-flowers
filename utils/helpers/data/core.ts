import { AppCurrency } from "../../types/Core";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const performHandshake: () => Promise<
  RequestResponse<{ currencies: AppCurrency }>
> = async () => {
  try {
    const response = await restAPIInstance.get("/v1/regal/handshake");
    return {
      error: false,
      data: response.currencies
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
