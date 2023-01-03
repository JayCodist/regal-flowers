import { FetchResourceParams } from "../../types/FetchResourceParams";
import Product from "../../types/Product";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const getProduct: (
  slug: string,
  relatedProductsCount?: number
) => Promise<RequestResponse<Product>> = async (
  slug,
  relatedProductsCount = 0
) => {
  try {
    const response = await restAPIInstance.get(
      `/v1/wordpress/product/single/${slug}?relatedProductsCount=${relatedProductsCount}`
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

export const getProductsByCategory: (
  params?: FetchResourceParams
) => Promise<RequestResponse<Product[]>> = async params => {
  try {
    const response = await restAPIInstance.get(
      `/v1/wordpress/product/paginate?pageNumber=${
        params?.pageNumber
      }&tags=${params?.filter?.tags?.join(
        ","
      )}&categories=${params?.filter?.category?.join(",")}&productClass=${
        params?.filter?.productClass
      }`
    );
    console.log("params", params);
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
    const response = await restAPIInstance.get("/v1/wordpress/product/all");
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

export const getProductsBySlugs: (
  slugs: string[]
) => Promise<RequestResponse<Product[]>> = async slugs => {
  try {
    const response = await restAPIInstance.get(
      `/v1/wordpress/product/slug-multiple?slugs=${slugs.join(",")}`
    );
    return {
      error: false,
      data: response.data as Product[]
    };
  } catch (err) {
    console.trace(err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
