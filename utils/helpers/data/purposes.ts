import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const getPurposes: () => Promise<
  RequestResponse<string[]>
> = async () => {
  try {
    const response = await restAPIInstance.get(`/v1/firebase/purposes`);
    return {
      error: false,
      data: response.data
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
