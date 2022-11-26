import RequestResponse from "../../types/RequestResponse";
import User from "../../types/User";
import { restAPIInstance } from "../rest-api-config";
import AppStorage from "../storage-helpers";

export const login: (
  email: string,
  password: string
) => Promise<RequestResponse<User>> = async (email, password) => {
  try {
    const response = await restAPIInstance.post("/v1/regal/auth/login", {
      email,
      password
    });
    AppStorage.save("userData", response.data);
    return {
      error: false,
      data: response
    };
  } catch (err) {
    console.error("Unable to login: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const signup: (
  email: string,
  password: string
) => Promise<RequestResponse<User>> = async (email, password) => {
  try {
    const response = await restAPIInstance.post("/v1/regal/auth/signup", {
      email,
      password
    });
    AppStorage.save("userData", response.data);
    return {
      error: false,
      data: response
    };
  } catch (err) {
    console.error("Unable to signup: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
