import axios from "axios";

// 1. Set the new BASE_URL
// We're using your new '/auth/' path but keeping 'localhost'
// to ensure cookies work correctly.
const BASE_URL = "http://localhost:8000/auth/";

// 2. Create the re-usable Axios instance with interceptor logic
// This is the "engine" that will power all our API calls
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // This is essential for sending/receiving cookies
});

/* 3. Create the Axios Interceptor
  This will automatically handle token refreshes on 401 errors
*/
apiClient.interceptors.response.use(
  // If the response is successful (2xx), just return it
  (response) => response,

  // If the response is an error
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 (Unauthorized) and not a retry
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("token/refresh")
    ) {
      originalRequest._retry = true; // Mark this request as "retried"

      try {
        // 4. Attempt to refresh the access token
        // This endpoint path must match your backend urls.py
        // If your refresh URL is also under /auth/, this is correct.
        await apiClient.post("token/refresh/");

        // 5. If refresh is successful, retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 6. If refresh fails, reject the promise
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just reject the promise
    return Promise.reject(error);
  }
);

// 7. Export your functions, now powered by apiClient

// ---- AUTH ENDPOINTS ----
export const login = async (username, password) => {
  const response = await apiClient.post("login/", { username, password });
  return response.data; // Contains user object with role
};

export const register = async (username, email, password, role = "patient") => {
  // This now includes the 'role' as you wanted
  const response = await apiClient.post("register/", {
    username,
    email,
    password,
    role,
  });
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post("logout/", {});
  return response.data;
};

export const authenticated_user = async () => {
  const response = await apiClient.get("authenticated/");
  return response.data; // Returns {id, username, email, role}
};

// ---- TODO ENDPOINT ----
export const get_todos = async () => {
  const response = await apiClient.get("todos/");
  return response.data;
};
