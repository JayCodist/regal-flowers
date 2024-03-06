import { business } from "../../constants";
import { BlogMinimal } from "../../types/Blog";
import { FetchResourceParams } from "../../types/FetchResourceParams";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const getBlogs: (
  params: FetchResourceParams
) => Promise<RequestResponse<BlogMinimal[]>> = async params => {
  const { pageNumber = 1, pageSize = 10 } = params;
  try {
    const response = await restAPIInstance.get(
      `/v1/blog/paginate?business=${business}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return {
      error: false,
      data: response.data.data as BlogMinimal[]
    };
  } catch (err) {
    console.error("Unable to get all blogs: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
