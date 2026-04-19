import { apiConfig } from "../../config/apiConfig";
import { request } from "../../lib/http/httpClient";

let rewardCache = null;

export async function loadRewards() {
  if (!apiConfig.useMockData) {
    return request(`${apiConfig.endpoints.bootstrap}/rewards`);
  }

  if (!rewardCache) {
    rewardCache = request(apiConfig.mockEndpoints.rewards, { headers: {} });
  }

  return rewardCache;
}
