function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

export function formatPaymentValue(field, value) {
  if (field === "cardNumber") {
    return digitsOnly(value)
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();
  }

  if (field === "expiry") {
    const digits = digitsOnly(value).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  if (field === "cvv") return digitsOnly(value).slice(0, 4);
  if (field === "routingNumber") return digitsOnly(value).slice(0, 9);
  if (field === "accountNumber") return digitsOnly(value).slice(0, 17);
  if (field === "afterpayPhone") return digitsOnly(value).slice(0, 10);
  if (field === "afterpayZip") return digitsOnly(value).slice(0, 5);

  return value;
}
