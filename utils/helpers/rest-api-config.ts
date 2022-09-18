const baseUrl = "https://regal-operations-defy.appspot.com";
// "https://service-default-dot-regal-operations-defy.appspot.com/v1/config/wordpress-proxy";

const restAPIHeaders = {
  "Content-Type": "application/json"
};
interface FetchInstanceType {
  get: (url: string, config?: RequestInit) => Promise<any>;
  post: (url: string, data?: any, config?: RequestInit) => Promise<any>;
  put: (url: string, data: any, config?: RequestInit) => Promise<any>;
  patch: (url: string, data: any, config?: RequestInit) => Promise<any>;
  delete: (url: string, config?: RequestInit) => Promise<any>;
}

const processResponse = async (response: Response) => {
  const json = await response.json();
  // Reject 4xx and 5xx responses
  if (/^(4|5)/.test(String(response.status))) {
    throw json;
  }
  return json;
};

export const restAPIInstance: FetchInstanceType = {
  get: (url, config) =>
    fetch(`${baseUrl}${url}`, {
      ...(config || {}),
      method: "GET",
      headers: {
        ...restAPIHeaders,
        ...(config?.headers || {})
      }
    }).then(processResponse),
  post: (url, data, config) =>
    fetch(`${baseUrl}${url}`, {
      body: JSON.stringify(data),
      ...(config || {}),
      method: "POST",
      headers: {
        ...restAPIHeaders,
        ...(config?.headers || {})
      }
    }).then(processResponse),
  put: (url, data, config) =>
    fetch(`${baseUrl}${url}`, {
      body: JSON.stringify(data),
      ...(config || {}),
      method: "PUT",
      headers: {
        ...restAPIHeaders,
        ...(config?.headers || {})
      }
    }).then(processResponse),
  patch: (url, data, config) =>
    fetch(`${baseUrl}${url}`, {
      body: JSON.stringify(data),
      ...(config || {}),
      method: "PATCH",
      headers: {
        ...restAPIHeaders,
        ...(config?.headers || {})
      }
    }).then(processResponse),
  delete: (url, config) =>
    fetch(`${baseUrl}${url}`, {
      ...(config || {}),
      method: "DELETE",
      headers: {
        ...restAPIHeaders,
        ...(config?.headers || {})
      }
    }).then(processResponse)
};
