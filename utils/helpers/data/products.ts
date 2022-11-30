import { FetchResourceParams } from "../../types/FetchResourceParams";
import Product from "../../types/Product";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const getProduct: (
  slug: string
) => Promise<RequestResponse<Product>> = async slug => {
  try {
    const response = await restAPIInstance.get(`/v1/wordpress/product/${slug}`);
    return {
      error: false,
      data: response.data as Product
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const getProductsByCategory: (
  params?: FetchResourceParams
) => Promise<RequestResponse<Product[]>> = async params => {
  try {
    const response = await restAPIInstance.get(
      `/v1/wordpress/product/paginate?pageNumber=${params?.pageNumber}&tags=${params?.filter?.tags}&categories=${params?.filter?.category}`
    );
    console.log("response", response.data);
    return {
      error: false,
      data: response.data.data as Product[]
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const getAllProducts: () => Promise<
  RequestResponse<Product[]>
> = async () => {
  try {
    const response = await restAPIInstance.get(`/v1/wordpress/product/all`);
    return {
      error: false,
      data: response.data.data as Product[]
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const getFeaturedProducts: () => Promise<
  RequestResponse<Product[]>
> = async () => {
  try {
    const response = await restAPIInstance.get(
      `/v1/wordpress/product/featured`
    );
    console.log("response", response.data);
    return {
      error: false,
      data: response.data as Product[]
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
