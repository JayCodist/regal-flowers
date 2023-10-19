import { ProductFilterLogic } from "../../../pages/filters";
import { business } from "../../constants";
import { FetchResourceParams } from "../../types/FetchResourceParams";
import Product from "../../types/Product";
import RequestResponse from "../../types/RequestResponse";
import { filterInStockProducts } from "../functions";
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
      `/v1/wordpress/product/single/${slug}?relatedProductsCount=${relatedProductsCount}&business=${business}`
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
  try {
    let query = "";
    if (params?.searchValue && params?.searchField) {
      query = `&searchValue=${params?.searchValue.toLowerCase()}&searchField=${
        params?.searchField
      }`;
    } else {
      const {
        category = [],
        productClass,
        budget = [],
        delivery = [],
        design = [],
        flowerName = [],
        flowerType = [],
        packages = []
      } = params?.filter as ProductFilterLogic;

      query = `&categories=${category?.join(",")}&${
        productClass ? `productClass=${productClass}` : ""
      }&budget=${budget?.join(",")}&delivery=${delivery?.join(
        ","
      )}&design=${design?.join(",")}&flowerName=${flowerName?.join(
        ","
      )}&flowerType=${flowerType?.join(",")}&packages=${packages?.join(",")}`;
    }

    const response = await restAPIInstance.get(
      `/v1/wordpress/product/paginate?business=${business}&pageNumber=${params?.pageNumber}&sortField=${params?.sortLogic?.sortField}&sortType=${params?.sortLogic?.sortType}${query}`
    );
    const data = filterInStockProducts(response.data.data);
    return {
      error: false,
      data
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
    const response = await restAPIInstance.get(
      `/v1/wordpress/product/all?business=${business}`
    );
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
      `/v1/wordpress/product/slug-multiple?slugs=${slugs.join(
        ","
      )}&business=${business}`
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
