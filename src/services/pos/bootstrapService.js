import { apiConfig } from "../../config/apiConfig";
import { request } from "../../lib/http/httpClient";

export async function loadBootstrapData() {
  if (!apiConfig.useMockData) {
    return request(apiConfig.endpoints.bootstrap);
  }

  const [inventory, paymentMethods, associates] = await Promise.all([
    request(apiConfig.mockEndpoints.inventory, { headers: {} }),
    request(apiConfig.mockEndpoints.paymentMethods, { headers: {} }),
    request(apiConfig.mockEndpoints.associates, { headers: {} })
  ]);

  return {
    inventory,
    paymentMethods,
    associates
  };
}
