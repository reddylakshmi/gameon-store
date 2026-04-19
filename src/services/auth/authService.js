import { apiConfig } from "../../config/apiConfig";
import { request } from "../../lib/http/httpClient";

export async function loginAssociate(credentials, associates = []) {
  if (!apiConfig.useMockData) {
    return request(apiConfig.endpoints.login, {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  }

  const match = associates.find(
    (associate) =>
      associate.associateId === credentials.associateId.trim().toUpperCase() &&
      associate.password === credentials.password
  );

  if (!match) {
    throw new Error("Invalid Associate ID or password.");
  }

  return match;
}
