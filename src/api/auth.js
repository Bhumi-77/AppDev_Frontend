import axios from "./axios";

const TOKEN_KEY = "appdev_token";

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    try {
      delete axios.defaults.headers.common["Authorization"];
    } catch (e) {}
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  setAuthToken(null);
}

// Initialize axios header from stored token on import
const existing = getAuthToken();
if (existing) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${existing}`;
}

export default {
  setAuthToken,
  getAuthToken,
  logout,
};
// Simple session helper for the customer area.
// The backend has no JWT/auth, so after register/login we just keep the
// returned customer (id + basic info) in sessionStorage.

const CUSTOMER_KEY = "customer";

export function saveCustomer(customer) {
  sessionStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer || {}));
}

export function getCustomer() {
  try {
    return JSON.parse(sessionStorage.getItem(CUSTOMER_KEY) || "null");
  } catch {
    return null;
  }
}

export function getCustomerId() {
  return getCustomer()?.id || null;
}

export function clearCustomer() {
  sessionStorage.removeItem(CUSTOMER_KEY);
}

export function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("user");
  clearCustomer();
}

export function isLoggedIn() {
  return Boolean(getCustomerId());
}
