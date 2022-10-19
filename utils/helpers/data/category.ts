import { Category } from "../../types/Category";
import { FetchResourceParams } from "../../types/FetchResourceParams";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const getCategory: (
  params: FetchResourceParams
) => Promise<RequestResponse<Category[]>> = async params => {
  try {
    const response = await restAPIInstance.get(
      `/v1/wordpress/category/paginate?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`
    );
    return {
      error: false,
      data: response.data.data as Category[]
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
