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
