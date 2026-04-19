import { apiConfig } from "../../config/apiConfig";
import { request } from "../../lib/http/httpClient";

let customerCache = null;
let orderCache = null;

async function loadCustomers() {
  if (!customerCache) {
    customerCache = request(apiConfig.mockEndpoints.customers, { headers: {} });
  }
  return customerCache;
}

async function loadOrders() {
  if (!orderCache) {
    orderCache = request(apiConfig.mockEndpoints.orders, { headers: {} });
  }
  return orderCache;
}

export async function searchCustomers(query) {
  if (!query.trim()) {
    return [];
  }

  if (!apiConfig.useMockData) {
    return request(`${apiConfig.endpoints.bootstrap}/customers/search?q=${encodeURIComponent(query)}`);
  }

  const customers = await loadCustomers();
  const lower = query.toLowerCase();
  return customers.filter(
    (customer) =>
      customer.email.toLowerCase().includes(lower) || customer.phone.includes(query)
  );
}

export async function getCustomerOrders(customerId) {
  if (!apiConfig.useMockData) {
    return request(`${apiConfig.endpoints.bootstrap}/customers/${customerId}/orders`);
  }

  const orders = await loadOrders();
  return orders.filter((order) => order.customerId === customerId);
}
