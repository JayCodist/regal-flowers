import Blog from "../../types/Blog";
import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";
import { business } from "../../constants";

export const getBlog: (slug: string) => Promise<RequestResponse<Blog>> = async (slug) => {
try {
  const response = await restAPIInstance.get(`/v1/blog/slug/${slug}?business=${business}`)
  return {
    error:false,
    data: response.data as Blog
  }
} catch (err) {
  return {
    error: true,
    message: (err as Error).message,
    data: null
  };
}
}

export const getAllBlogs: () => Promise<RequestResponse<Blog[]>> = async () =>{
  try {
    const response = await restAPIInstance.get(`/v1/blog/paginate?business=${business}&searchStr=&sortField=dateCreated`)
    return {
      error:false,
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

}