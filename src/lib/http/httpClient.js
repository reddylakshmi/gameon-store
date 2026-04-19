function buildHeaders(headers = {}) {
  return {
    "Content-Type": "application/json",
    ...headers
  };
}

export async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers)
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && payload?.message) ||
      (typeof payload === "string" && payload) ||
      "Request failed.";

    throw new Error(message);
  }

  return payload;
}
