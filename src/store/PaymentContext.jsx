import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialPaymentForm } from "@/lib/constants/payment";
import { submitCheckout } from "@/services/checkout/paymentService";
import { requestCardReaderAuth } from "@/services/checkout/paymentService";
import { validatePaymentDetails } from "@/utils/validators/payment";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useCustomer } from "./CustomerContext";
import { useHardware } from "./HardwareContext";
import { useInventory } from "./InventoryContext";
import { useLoyalty } from "./LoyaltyContext";
import { useToast } from "./ToastContext";

const cardReaderMethods = new Set(["credit", "debit"]);

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const { showToast } = useToast();
  const { associate } = useAuth();
  const { paymentMethods, decrementStock, markCheckoutComplete } = useInventory();
  const { cart, cartCount, clearCart } = useCart();
  const { activeCustomer } = useCustomer();
  const { subtotal, tax, total, appliedCoupon, appliedTradeInCredit, appliedReward, resetDiscounts } = useLoyalty();
  const { enqueueTransaction } = useHardware();

  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [paymentErrors, setPaymentErrors] = useState({});
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isReadingCard, setIsReadingCard] = useState(false);
  const [readerResponse, setReaderResponse] = useState(null);
  const [manualEntryEnabled, setManualEntryEnabled] = useState(false);

  useEffect(() => {
    if (!associate) resetPaymentFlow();
  }, [associate]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPaymentLabel =
    paymentMethods.find((m) => m.id === selectedPaymentMethod)?.label ?? "Payment";

  function resetPaymentFlow() {
    setCheckoutStep("cart");
    setSelectedPaymentMethod(paymentMethods[0]?.id ?? "credit");
    setPaymentForm(initialPaymentForm);
    setPaymentErrors({});
    setReaderResponse(null);
    setManualEntryEnabled(false);
    setIsReadingCard(false);
  }

  const beginCheckout = useCallback(() => {
    if (!cart.length) {
      showToast("Add items to the cart before checkout.", "info");
      return;
    }
    setPaymentErrors({});
    setCheckoutStep("payment");
    setReaderResponse(null);
    setManualEntryEnabled(false);
  }, [cart, showToast]);

  const handlePaymentMethodChange = useCallback((methodId) => {
    setSelectedPaymentMethod(methodId);
    setPaymentErrors({});
    setReaderResponse(null);
    setManualEntryEnabled(false);
    setPaymentForm(initialPaymentForm);
  }, []);

  const handlePaymentFieldChange = useCallback((field, value) => {
    setPaymentForm((current) => ({ ...current, [field]: value }));
    setPaymentErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const startCardReaderFlow = useCallback(async () => {
    try {
      setPaymentErrors({});
      setIsReadingCard(true);
      const response = await requestCardReaderAuth(selectedPaymentMethod);
      setReaderResponse(response);

      if (response.status !== "approved") {
        setManualEntryEnabled(true);
        setPaymentErrors({ form: response.message });
        return;
      }

      setManualEntryEnabled(false);
      setPaymentForm((current) => ({
        ...current,
        nameOnCard: response.cardholderName ?? current.nameOnCard
      }));
    } catch (error) {
      setManualEntryEnabled(true);
      setPaymentErrors({ form: error.message || "Card reader failed. Enter details manually." });
    } finally {
      setIsReadingCard(false);
    }
  }, [selectedPaymentMethod]);

  const enableManualEntry = useCallback(() => {
    setManualEntryEnabled(true);
    setReaderResponse(null);
    setPaymentErrors((current) => ({
      ...current,
      form: "Manual entry enabled. Enter card details and retry payment."
    }));
  }, []);

  const submitPayment = useCallback(async () => {
    if (!cart.length) {
      resetPaymentFlow();
      showToast("Cart is empty. Start a new sale.", "info");
      return;
    }

    const needsReader = cardReaderMethods.has(selectedPaymentMethod);

    if (needsReader && !readerResponse?.token && !manualEntryEnabled) {
      await startCardReaderFlow();
      return;
    }

    if (needsReader && manualEntryEnabled || !needsReader) {
      const errors = validatePaymentDetails(selectedPaymentMethod, paymentForm);
      if (Object.keys(errors).length > 0) {
        setPaymentErrors(errors);
        return;
      }
    }

    const payload = {
      associateId: associate.id,
      customerId: activeCustomer?.id ?? null,
      cart,
      paymentMethod: selectedPaymentMethod,
      paymentDetails: paymentForm,
      readerAuth: readerResponse,
      appliedCoupon,
      appliedTradeInCredit,
      appliedReward,
      subtotal,
      tax,
      total
    };

    try {
      setIsSubmittingPayment(true);

      if (!navigator.onLine) {
        await enqueueTransaction(payload);
        showToast("Offline transaction queued. It will sync when connectivity returns.", "info");
      } else {
        await submitCheckout(payload);
        showToast(
          `Order successful. ${cartCount} item${cartCount === 1 ? "" : "s"} paid.`,
          "success"
        );
      }

      const soldIds = new Map(cart.map((e) => [e.id, e.quantity]));
      decrementStock(soldIds);
      resetDiscounts();
      clearCart();
      resetPaymentFlow();
      markCheckoutComplete();
    } catch (error) {
      setPaymentErrors({ form: error.message || "Payment could not be processed." });
    } finally {
      setIsSubmittingPayment(false);
    }
  }, [
    cart, cartCount, selectedPaymentMethod, readerResponse, manualEntryEnabled,
    paymentForm, associate, activeCustomer, appliedCoupon, appliedTradeInCredit,
    appliedReward, subtotal, tax, total, enqueueTransaction, decrementStock,
    resetDiscounts, clearCart, markCheckoutComplete, showToast, startCardReaderFlow
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      checkoutStep,
      selectedPaymentMethod,
      selectedPaymentLabel,
      paymentForm,
      paymentErrors,
      isSubmittingPayment,
      isReadingCard,
      readerResponse,
      manualEntryEnabled,
      resetPaymentFlow,
      beginCheckout,
      handlePaymentMethodChange,
      handlePaymentFieldChange,
      startCardReaderFlow,
      enableManualEntry,
      submitPayment
    }),
    [
      checkoutStep, selectedPaymentMethod, selectedPaymentLabel, paymentForm,
      paymentErrors, isSubmittingPayment, isReadingCard, readerResponse,
      manualEntryEnabled, beginCheckout, handlePaymentMethodChange,
      handlePaymentFieldChange, startCardReaderFlow, enableManualEntry, submitPayment
    ]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
  return useContext(PaymentContext);
}
