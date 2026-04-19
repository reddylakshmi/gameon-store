function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

function luhnCheck(cardNumber) {
  const digits = digitsOnly(cardNumber);
  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return digits.length >= 13 && sum % 10 === 0;
}

function validateExpiry(value) {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return "Enter expiry as MM/YY.";
  }

  const [monthText, yearText] = value.split("/");
  const month = Number(monthText);
  const year = Number(`20${yearText}`);

  if (month < 1 || month > 12) {
    return "Expiry month must be between 01 and 12.";
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card expiry date is in the past.";
  }

  return "";
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validatePaymentDetails(selectedPaymentMethod, paymentForm) {
  const errors = {};

  if (selectedPaymentMethod === "credit" || selectedPaymentMethod === "debit") {
    if (!paymentForm.nameOnCard.trim()) {
      errors.nameOnCard = "Name on card is required.";
    }

    if (!luhnCheck(paymentForm.cardNumber)) {
      errors.cardNumber = "Enter a valid card number.";
    }

    const expiryError = validateExpiry(paymentForm.expiry);
    if (expiryError) {
      errors.expiry = expiryError;
    }

    if (!/^\d{3,4}$/.test(paymentForm.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits.";
    }
  }

  if (selectedPaymentMethod === "bank") {
    if (!paymentForm.bankName.trim()) {
      errors.bankName = "Bank name is required.";
    }

    if (!paymentForm.accountHolder.trim()) {
      errors.accountHolder = "Account holder is required.";
    }

    if (!/^\d{9}$/.test(paymentForm.routingNumber)) {
      errors.routingNumber = "Routing number must be 9 digits.";
    }

    if (!/^\d{6,17}$/.test(paymentForm.accountNumber)) {
      errors.accountNumber = "Account number must be between 6 and 17 digits.";
    }
  }

  if (selectedPaymentMethod === "paypal") {
    if (!validateEmail(paymentForm.paypalEmail)) {
      errors.paypalEmail = "Enter a valid PayPal email.";
    }

    if (paymentForm.paypalPassword.length < 6) {
      errors.paypalPassword = "PayPal password must be at least 6 characters.";
    }
  }

  if (selectedPaymentMethod === "afterpay") {
    if (!paymentForm.afterpayName.trim()) {
      errors.afterpayName = "Customer full name is required.";
    }

    if (!validateEmail(paymentForm.afterpayEmail)) {
      errors.afterpayEmail = "Enter a valid email address.";
    }

    if (!/^\d{10}$/.test(paymentForm.afterpayPhone)) {
      errors.afterpayPhone = "Phone number must be 10 digits.";
    }

    if (!/^\d{5}$/.test(paymentForm.afterpayZip)) {
      errors.afterpayZip = "ZIP code must be 5 digits.";
    }
  }

  return errors;
}
