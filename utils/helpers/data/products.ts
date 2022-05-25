import Product from "../../types/Product";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const getProduct: (
  slug: string
) => Promise<RequestResponse<Product>> = async slug => {
  try {
    const response = await restAPIInstance.get(
      `/products?business=regalFlowers&slug=${slug}`
    );
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
