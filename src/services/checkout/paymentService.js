import { apiConfig } from "../../config/apiConfig";
import { request } from "../../lib/http/httpClient";

let paymentResponseCache = null;

async function loadPaymentResponses() {
  if (!apiConfig.useMockData) {
    return null;
  }

  if (!paymentResponseCache) {
    paymentResponseCache = request(apiConfig.mockEndpoints.paymentResponses, { headers: {} });
  }

  return paymentResponseCache;
}

export async function requestCardReaderAuth(methodId) {
  if (!apiConfig.useMockData) {
    return request(`${apiConfig.endpoints.checkout}/reader-auth`, {
      method: "POST",
      body: JSON.stringify({ paymentMethod: methodId })
    });
  }

  const responses = await loadPaymentResponses();
  const response = responses?.reader?.[methodId]?.success ?? {
    status: "approved",
    message: "Reader approved the transaction.",
    token: `tok_${methodId}_${Date.now()}`
  };

  await new Promise((resolve) => window.setTimeout(resolve, 1200));
  return response;
}

export async function submitCheckout(payload) {
  if (!apiConfig.useMockData) {
    return request(apiConfig.endpoints.checkout, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  const responses = await loadPaymentResponses();
  const response = responses?.checkout?.[payload.paymentMethod]?.success ?? {
    status: "approved",
    message: "Payment approved.",
    orderId: `ORDER-${Date.now()}`
  };

  await new Promise((resolve) => window.setTimeout(resolve, 450));

  return {
    success: true,
    orderId: response.orderId,
    chargedAmount: payload.total,
    paymentMethod: payload.paymentMethod,
    message: response.message
  };
}
