interface RequestResponse<T = any> {
  error?: boolean;
  message?: string;
  data: T | null;
  status?: number;
}

export default RequestResponse;
