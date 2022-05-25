interface RequestResponse<T = any> {
  error?: boolean;
  message?: string;
  data: T | null;
}

export default RequestResponse;
