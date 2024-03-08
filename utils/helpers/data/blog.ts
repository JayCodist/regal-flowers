import { Blog } from "../../types/Blog";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";
import { business } from "../../constants";
import { FetchResourceParams } from "../../types/FetchResourceParams";
import { BlogMinimal } from "../../types/Blog";

export const getBlog: (
  slug: string
) => Promise<RequestResponse<Blog>> = async slug => {
  try {
    const response = await restAPIInstance.get(
      `/v1/blog/slug/${slug}?business=${business}`
    );
    return {
      error: false,
      data: response.data as Blog
    };
  } catch (err) {
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};

export const getAllBlogs: () => Promise<RequestResponse<Blog[]>> = async () => {
  try {
    const response = await restAPIInstance.get(
      `/v1/blog/paginate?business=${business}&searchStr=&sortField=dateCreated`
    );
    return {
      error: false,
      data: response.data.data as Blog[]
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
