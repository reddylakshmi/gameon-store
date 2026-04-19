const useMockData = import.meta.env.VITE_USE_MOCK_DATA === "true";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const apiConfig = {
  useMockData,
  apiBaseUrl,
  endpoints: {
    bootstrap: `${apiBaseUrl}/pos/bootstrap`,
    login: `${apiBaseUrl}/auth/associate-login`,
    checkout: `${apiBaseUrl}/checkout`
  },
  mockEndpoints: {
    inventory: "/mock-data/items.json",
    paymentMethods: "/mock-data/payment-methods.json",
    associates: "/mock-data/associates.json",
    paymentResponses: "/mock-data/payment-responses.json",
    customers: "/mock-data/customers.json",
    orders: "/mock-data/orders.json",
    rewards: "/mock-data/rewards.json",
    notifications: "/mock-data/notifications.json",
    hardware: "/mock-data/hardware.json"
  }
};
