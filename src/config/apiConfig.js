const useMockData = import.meta.env.VITE_USE_MOCK_DATA === "true";

export const apiConfig = {
  useMockData,
  endpoints: {
    login:         `${import.meta.env.VITE_AUTH_SERVICE_URL}/auth/associate-login`,
    bootstrap:     `${import.meta.env.VITE_POS_SERVICE_URL}/pos/bootstrap`,
    checkout:      `${import.meta.env.VITE_CHECKOUT_SERVICE_URL}/checkout`,
    customers:     `${import.meta.env.VITE_CUSTOMER_SERVICE_URL}/customers`,
    rewards:       `${import.meta.env.VITE_LOYALTY_SERVICE_URL}/rewards`,
    notifications: `${import.meta.env.VITE_NOTIFICATION_SERVICE_URL}/notifications`,
    hardware:      `${import.meta.env.VITE_DEVICE_SERVICE_URL}/hardware`,
  },
  mockEndpoints: {
    inventory:        "/mock-data/items.json",
    paymentMethods:   "/mock-data/payment-methods.json",
    associates:       "/mock-data/associates.json",
    paymentResponses: "/mock-data/payment-responses.json",
    customers:        "/mock-data/customers.json",
    orders:           "/mock-data/orders.json",
    rewards:          "/mock-data/rewards.json",
    notifications:    "/mock-data/notifications.json",
    hardware:         "/mock-data/hardware.json"
  }
};
