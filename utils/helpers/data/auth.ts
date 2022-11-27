import RequestResponse from "../../types/RequestResponse";
import User from "../../types/User";
import { restAPIInstance } from "../rest-api-config";
import AppStorage from "../storage-helpers";

export const login: (
  email: string,
  password: string
) => Promise<RequestResponse<User>> = async (email, password) => {
  try {
    const { data } = await restAPIInstance.post("/v1/regal/auth/login", {
      email,
      password
    });
    AppStorage.save("userData", data);
    return {
      error: false,
      data
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
    const { data } = await restAPIInstance.post("/v1/regal/auth/signup", {
      email,
      password
    });
    AppStorage.save("userData", data);
    return {
      error: false,
      data
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

export const requestOtp: (
  email: string
) => Promise<RequestResponse<User>> = async email => {
  try {
    await restAPIInstance.post("/v1/regal/auth/otp/request", {
      email
    });
    return {
      error: false,
      data: null
    };
  } catch (err) {
    console.error("Unable to request otp: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const changePassword: (
  email: string,
  otp: string,
  password: string
) => Promise<RequestResponse<User>> = async (email, code, password) => {
  try {
    const { data } = await restAPIInstance.put(
      "/v1/regal/auth/otp/change-password",
      {
        email,
        password,
        code
      }
    );
    AppStorage.save("userData", data);
    return {
      error: false,
      data
    };
  } catch (err) {
    console.error("Unable to change password: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
