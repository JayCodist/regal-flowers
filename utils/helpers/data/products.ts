import { ProductFilterLogic } from "../../../pages/filters";
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
  params?: FetchResourceParams<ProductFilterLogic>
) => Promise<RequestResponse<Product[]>> = async params => {
  const {
    category,
    productClass,
    budget = [],
    delivery = [],
    design = [],
    flowerName = [],
    flowerType = [],
    packages = []
  } = params?.filter as ProductFilterLogic;
  console.log("params", params);
  try {
    const response = await restAPIInstance.get(
      `/v1/wordpress/product/paginate?pageNumber=${
        params?.pageNumber
      }&categories=${category?.join(",")}&${
        productClass ? `productClass=${productClass}` : ""
      }&sortField=${params?.sortLogic?.sortField}&sortType=${
        params?.sortLogic?.sortType
      }&budget=${budget?.join(",")}&delivery=${delivery?.join(
        ","
      )}&design=${design?.join(",")}&flowerName=${flowerName?.join(
        ","
      )}&flowerType=${flowerType?.join(",")}&packages=${packages?.join(",")}`
    );
    return {
      error: false,
      data: response.data.data as Product[]
    };
  } catch (err) {
    console.error("Unable to get products by category: ", err);
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
    console.error("Unable to get all products: ", err);
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
    console.error("Unable to get products by slugs", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
