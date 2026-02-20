const BASE_URL = "http://localhost:5000/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`API Error: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, params, headers = {} } = options;

  const url = new URL(
    `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const getHeaders = (token?: string, isFormData?: boolean) => {
    const defaultHeaders: Record<string, string> = {};
    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }
    const activeToken = token || localStorage.getItem("token");
    if (activeToken) {
      defaultHeaders["Authorization"] = `Bearer ${activeToken}`;
    }
    return { ...defaultHeaders, ...headers };
  };

  const executeRequest = async (token?: string) => {
    const isFormData = body instanceof FormData;
    const config: RequestInit = {
      method,
      headers: getHeaders(token, isFormData),
    };

    if (body && method !== "GET") {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    return fetch(url.toString(), config);
  };

  let response = await executeRequest();

  // Handle 401 and try Refresh Token
  if (
    response.status === 401 &&
    !endpoint.includes("/auth/login") &&
    !endpoint.includes("/auth/refresh-token")
  ) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const { data } = await refreshRes.json();
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            isRefreshing = false;
            onRefreshed(data.accessToken);
          } else {
            throw new Error("Refresh failed");
          }
        } catch (err) {
          isRefreshing = false;
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          throw new ApiError(401, { message: "Session expired" });
        }
      } else {
        window.location.href = "/login";
        throw new ApiError(401, { message: "Not authenticated" });
      }
    }

    return new Promise<T>((resolve, reject) => {
      subscribeTokenRefresh(async (newToken) => {
        try {
          const retryRes = await executeRequest(newToken);
          if (!retryRes.ok) throw new Error("Retry failed");

          if (retryRes.status === 204) {
            resolve({} as T);
            return;
          }

          const result = await retryRes.json();
          resolve(result.data || result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "An unknown error occurred" };
    }
    throw new ApiError(response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const result = await response.json();
  return result.data || result;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "POST", body }),

  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PATCH", body }),

  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PUT", body }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
