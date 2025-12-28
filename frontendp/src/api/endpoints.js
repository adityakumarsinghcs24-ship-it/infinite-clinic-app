import axios from "axios";

// 1. Use localhost instead of 127.0.0.1 to avoid cookie domain mismatch
const AUTH_BASE_URL = "http://localhost:8000/auth/";
// 2. FIX: Set app base URL to the root, as requested
const APP_BASE_URL = "http://localhost:8000/";

// 3. Create an Axios client for AUTH functions
const authApiClient = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
});

// 3. Create an Axios client for regular APP functions
const appApiClient = axios.create({
  baseURL: APP_BASE_URL,
  withCredentials: true,
});

// 4. Add the interceptor ONLY to the appApiClient
appApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("token/refresh")
    ) {
      originalRequest._retry = true;
      try {
        // 5. Use the authApiClient to refresh the token
        await authApiClient.post("token/refresh/");
        // 6. Retry the original request with the appApiClient
        return appApiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// ---- AUTH ENDPOINTS (using authApiClient) ----
export const login = async (username, password) => {
  const response = await authApiClient.post("login/", { username, password });
  return response.data;
};

export const register = async (username, email, password, role = "patient") => {
  const response = await authApiClient.post("register/", {
    username,
    email,
    password,
    role,
  });
  return response.data;
};

export const logout = async () => {
  const response = await authApiClient.post("logout/", {});
  return response.data;
};

export const authenticated_user = async () => {
  const response = await authApiClient.get("authenticated/");
  return response.data;
};

// ---- GENERAL DATA ENDPOINTS (using appApiClient) ----
export const get_tests = async () => {
  const response = await appApiClient.get("tests/");
  return response.data;
};

export const get_consultations = async () => {
  const response = await appApiClient.get("consultations/");
  return response.data;
};

// ---- CART ENDPOINTS (using appApiClient) ----

// Fetch the user's cart (with its items)
export const get_cart = async () => {
  const response = await appApiClient.get("cart/"); // Calls /cart/
  return response.data;
};

// Add an item to the cart
export const add_to_cart = async (itemType, itemId, quantity = 1) => {
  // itemType should be 'test' or 'consult'
  const data = { quantity, item_type: itemType };
  if (itemType === "test") {
    data.test = itemId;
  } else if (itemType === "consult") {
    data.consult = itemId;
  }
  const response = await appApiClient.post("cartitems/", data); // Calls /cartitems/
  return response.data;
};

// Update an item's quantity in the cart
export const update_cart_item_quantity = async (cartItemId, quantity) => {
  const response = await appApiClient.patch(`cartitems/${cartItemId}/`, {
    quantity,
  });
  return response.data;
};

// Remove an item from the cart
export const remove_from_cart = async (cartItemId) => {
  const response = await appApiClient.delete(`cartitems/${cartItemId}/`);
  return response.data;
};

// Placeholder for checkout/order finalization (if you add a backend endpoint)
export const checkout_cart = async () => {
  return { success: true, message: "Checkout initiated!" };
};
