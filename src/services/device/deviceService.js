import { apiConfig } from "../../config/apiConfig";
import { request } from "../../lib/http/httpClient";

let hardwareCache = null;

export async function loadHardwareState() {
  if (!apiConfig.useMockData) {
    return request(`${apiConfig.endpoints.bootstrap}/hardware`);
  }

  if (!hardwareCache) {
    hardwareCache = request(apiConfig.mockEndpoints.hardware, { headers: {} });
  }

  return hardwareCache;
}
