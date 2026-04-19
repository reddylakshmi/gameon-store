import { useEffect, useMemo, useState } from "react";
import { appConfig } from "../config/appConfig";
import useBootstrapData from "../hooks/useBootstrapData";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { initialPaymentForm } from "../lib/constants/payment";
import {
  addQueuedTransaction,
  getQueuedTransactions,
  removeQueuedTransaction
} from "../lib/storage/offlineQueue";
import { loginAssociate } from "../services/auth/authService";
import { searchCustomers, getCustomerOrders } from "../services/customer/customerService";
import { loadHardwareState } from "../services/device/deviceService";
import { requestCardReaderAuth, submitCheckout } from "../services/checkout/paymentService";
import { loadRewards } from "../services/loyalty/loyaltyService";
import {
  loadNotificationTemplates,
  showServiceWorkerNotification
} from "../services/notifications/notificationService";
import { validatePaymentDetails } from "../utils/validators/payment";

const cardReaderMethods = new Set(["credit", "debit"]);

function usePosStore() {
  const { inventory, paymentMethods, associates, isBootstrapping, bootstrapError } = useBootstrapData();

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [platform, setPlatform] = useState("All Platforms");
  const [status, setStatus] = useState("Loading inventory...");
  const [successMessage, setSuccessMessage] = useState("");
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [paymentErrors, setPaymentErrors] = useState({});
  const [associate, setAssociate] = useState(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isReadingCard, setIsReadingCard] = useState(false);
  const [readerResponse, setReaderResponse] = useState(null);
  const [manualEntryEnabled, setManualEntryEnabled] = useState(false);

  const [customerQuery, setCustomerQuery] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerOrderSearch, setCustomerOrderSearch] = useState("");
  const [activeReturnSession, setActiveReturnSession] = useState(null);
  const [rewardCatalog, setRewardCatalog] = useState([]);
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false);
  const [redemptionMode, setRedemptionMode] = useState("cash");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [appliedTradeInCredit, setAppliedTradeInCredit] = useState(0);
  const [appliedReward, setAppliedReward] = useState(null);

  const [hardwareState, setHardwareState] = useState({
    pairedPrinters: [],
    pairedScanners: []
  });
  const [isHardwareDrawerOpen, setIsHardwareDrawerOpen] = useState(false);
  const [notificationTemplates, setNotificationTemplates] = useState([]);
  const [syncPendingCount, setSyncPendingCount] = useState(0);

  const debouncedCustomerQuery = useDebouncedValue(customerQuery, 350);

  useEffect(() => {
    setItems(inventory);
  }, [inventory]);

  useEffect(() => {
    if (bootstrapError) {
      setStatus(bootstrapError);
      return;
    }

    if (!isBootstrapping && inventory.length) {
      setStatus(`${inventory.length} products ready for checkout.`);
    }
  }, [bootstrapError, inventory, isBootstrapping]);

  useEffect(() => {
    async function hydrateSupportState() {
      const [rewards, hardware, notifications, queued] = await Promise.all([
        loadRewards(),
        loadHardwareState(),
        loadNotificationTemplates(),
        getQueuedTransactions()
      ]);

      setRewardCatalog(rewards);
      setHardwareState(hardware);
      setNotificationTemplates(notifications);
      setSyncPendingCount(queued.length);
    }

    hydrateSupportState();
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage("");
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  useEffect(() => {
    async function lookupCustomers() {
      if (!debouncedCustomerQuery.trim()) {
        setCustomerResults([]);
        return;
      }

      setIsSearchingCustomers(true);
      try {
        const results = await searchCustomers(debouncedCustomerQuery);
        setCustomerResults(results);
      } finally {
        setIsSearchingCustomers(false);
      }
    }

    lookupCustomers();
  }, [debouncedCustomerQuery]);

  useEffect(() => {
    async function syncPendingQueue() {
      if (!navigator.onLine) {
        return;
      }

      const queued = await getQueuedTransactions();
      if (!queued.length) {
        setSyncPendingCount(0);
        return;
      }

      for (const entry of queued) {
        await submitCheckout(entry.payload);
        await removeQueuedTransaction(entry.id);
      }

      setSyncPendingCount(0);
      setSuccessMessage("Pending offline transactions synced.");
    }

    function handleOnline() {
      syncPendingQueue();
    }

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const platforms = useMemo(() => {
    const names = new Set(items.map((item) => item.platform));
    return ["All Platforms", ...names];
  }, [items]);

  const categories = useMemo(() => {
    const names = Array.from(new Set(items.map((item) => item.category)));
    return ["All", ...names];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = search.toLowerCase();
      const searchMatch =
        item.name.toLowerCase().includes(query) ||
        item.platform.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      const categoryMatch = category === "All" || item.category === category;
      const platformMatch = platform === "All Platforms" || item.platform === platform;
      return searchMatch && categoryMatch && platformMatch;
    });
  }, [category, items, platform, search]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const rewardCashCharge = appliedReward?.mode === "cash" ? appliedReward.cashCost : 0;
  const subtotal = cartSubtotal + rewardCashCharge;
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const tradeInAvailable = activeCustomer?.tradeInCredit ?? 0;
  const tradeInApplied = Math.min(appliedTradeInCredit, Math.max(0, subtotal - couponDiscount));
  const rewardDiscount = appliedReward?.mode === "points" ? appliedReward.cashCost : 0;
  const adjustedSubtotal = Math.max(0, subtotal - couponDiscount - tradeInApplied - rewardDiscount);
  const tax = adjustedSubtotal * appConfig.taxRate;
  const total = adjustedSubtotal + tax;

  const selectedPaymentLabel =
    paymentMethods.find((method) => method.id === selectedPaymentMethod)?.label ?? "Payment";

  const loyaltyNudge = useMemo(() => {
    if (!activeCustomer) {
      return null;
    }

    const usedGame = items.find(
      (item) => item.category === "Game" && item.price <= 20 && item.stockCount > 0
    );

    if (!usedGame) {
      return null;
    }

    return {
      targetPrice: usedGame.price,
      message: `Add ${usedGame.name} for ${usedGame.price.toFixed(2)} to push ${activeCustomer.name} toward the next reward today.`
    };
  }, [activeCustomer, items]);

  function resetPaymentFlow() {
    setCheckoutStep("cart");
    setSelectedPaymentMethod(paymentMethods[0]?.id ?? "credit");
    setPaymentForm(initialPaymentForm);
    setPaymentErrors({});
    setReaderResponse(null);
    setManualEntryEnabled(false);
    setIsReadingCard(false);
  }

  async function handleLogin(credentials, loadedAssociates = associates) {
    const account = await loginAssociate(credentials, loadedAssociates);
    setAssociate({
      id: account.associateId,
      name: account.name,
      role: account.role
    });
    setStatus(`Associate ${account.associateId} signed in. ${items.length || "All"} products ready.`);
    setSuccessMessage(`Welcome, ${account.name}.`);
  }

  function handleLogout() {
    setAssociate(null);
    setCart([]);
    setActiveCustomer(null);
    setCustomerResults([]);
    setCustomerQuery("");
    resetPaymentFlow();
    setStatus("Associate signed out.");
  }

  function addToCart(item) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((entry) => entry.id === item.id);
      const quantityInCart = existingItem?.quantity ?? 0;

      if (quantityInCart >= item.stockCount) {
        setSuccessMessage(`Only ${item.stockCount} ${item.name} in stock.`);
        return currentCart;
      }

      if (existingItem) {
        return currentCart.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
  }

  function updateQuantity(itemId, nextQuantity) {
    setCart((currentCart) =>
      currentCart.flatMap((entry) => {
        if (entry.id !== itemId) {
          return [entry];
        }

        if (nextQuantity <= 0) {
          return [];
        }

        const sourceItem = items.find((item) => item.id === itemId);
        const clampedQuantity = Math.min(nextQuantity, sourceItem?.stockCount ?? nextQuantity);
        return [{ ...entry, quantity: clampedQuantity }];
      })
    );
  }

  function beginCheckout() {
    if (!cart.length) {
      setSuccessMessage("Add items to the cart before checkout.");
      return;
    }

    setPaymentErrors({});
    setCheckoutStep("payment");
    setReaderResponse(null);
    setManualEntryEnabled(false);
  }

  function handlePaymentMethodChange(methodId) {
    setSelectedPaymentMethod(methodId);
    setPaymentErrors({});
    setReaderResponse(null);
    setManualEntryEnabled(false);
    setPaymentForm(initialPaymentForm);
  }

  function handlePaymentFieldChange(field, value) {
    setPaymentForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));

    setPaymentErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function startCardReaderFlow() {
    try {
      setPaymentErrors({});
      setIsReadingCard(true);
      const response = await requestCardReaderAuth(selectedPaymentMethod);
      setReaderResponse(response);

      if (response.status !== "approved") {
        setManualEntryEnabled(true);
        setPaymentErrors({
          form: response.message
        });
        return;
      }

      setManualEntryEnabled(false);
      setPaymentForm((currentForm) => ({
        ...currentForm,
        nameOnCard: response.cardholderName ?? currentForm.nameOnCard
      }));
    } catch (error) {
      setManualEntryEnabled(true);
      setPaymentErrors({
        form: error.message || "Card reader failed. Enter details manually."
      });
    } finally {
      setIsReadingCard(false);
    }
  }

  function enableManualEntry() {
    setManualEntryEnabled(true);
    setReaderResponse(null);
    setPaymentErrors((current) => ({
      ...current,
      form: "Manual entry enabled. Enter card details and retry payment."
    }));
  }

  async function submitPayment() {
    if (!cart.length) {
      resetPaymentFlow();
      setSuccessMessage("Cart is empty. Start a new sale.");
      return;
    }

    if (cardReaderMethods.has(selectedPaymentMethod) && !readerResponse?.token && !manualEntryEnabled) {
      await startCardReaderFlow();
      return;
    }

    if (cardReaderMethods.has(selectedPaymentMethod) && manualEntryEnabled) {
      const errors = validatePaymentDetails(selectedPaymentMethod, paymentForm);
      if (Object.keys(errors).length > 0) {
        setPaymentErrors(errors);
        return;
      }
    }

    if (!cardReaderMethods.has(selectedPaymentMethod)) {
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
      appliedTradeInCredit: tradeInApplied,
      appliedReward,
      subtotal,
      tax,
      total
    };

    try {
      setIsSubmittingPayment(true);

      if (!navigator.onLine) {
        await addQueuedTransaction({
          id: `queue-${Date.now()}`,
          payload
        });
        const queued = await getQueuedTransactions();
        setSyncPendingCount(queued.length);
      } else {
        await submitCheckout(payload);
      }

      const soldIds = new Map(cart.map((entry) => [entry.id, entry.quantity]));

      setItems((currentItems) =>
        currentItems.map((item) => ({
          ...item,
          stockCount: Math.max(item.stockCount - (soldIds.get(item.id) ?? 0), 0)
        }))
      );

      setCart([]);
      setAppliedCoupon(null);
      setAppliedTradeInCredit(0);
      setAppliedReward(null);
      resetPaymentFlow();
      setSuccessMessage(
        navigator.onLine
          ? `Order successful. ${cartCount} item${cartCount === 1 ? "" : "s"} paid.`
          : "Offline transaction queued. It will sync when connectivity returns."
      );
      setStatus(`Last checkout closed at ${new Date().toLocaleTimeString()}.`);
    } catch (error) {
      setPaymentErrors({
        form: error.message || "Payment could not be processed."
      });
    } finally {
      setIsSubmittingPayment(false);
    }
  }

  async function selectCustomer(customer) {
    setActiveCustomer(customer);
    setIsCustomerDrawerOpen(true);
    setCustomerQuery(customer.email);
    setCustomerResults([]);
    const orders = await getCustomerOrders(customer.id);
    setCustomerOrders(orders);
    setStatus(`Customer ${customer.name} attached to active cart.`);
  }

  function openCustomerDrawer() {
    if (activeCustomer) {
      setIsCustomerDrawerOpen(true);
    }
  }

  function hydrateReturnSession(order) {
    const sessionItems = order.items.map((item) => {
      const orderDate = new Date(order.orderDate);
      const eligible = Date.now() - orderDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
      return {
        ...item,
        eligible,
        disposition: "Resellable"
      };
    });

    setActiveReturnSession({
      orderId: order.id,
      orderDate: order.orderDate,
      items: sessionItems
    });
    setSuccessMessage(`Return session started from ${order.id}.`);
  }

  function updateReturnDisposition(itemId, disposition) {
    setActiveReturnSession((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, disposition } : item
      )
    }));
  }

  function applyCouponToCart(coupon) {
    setAppliedCoupon(coupon);
    setSuccessMessage(`${coupon.code} applied to the active cart.`);
  }

  function applyTradeCreditToCart() {
    if (!activeCustomer) {
      return;
    }
    setAppliedTradeInCredit(activeCustomer.tradeInCredit);
    setSuccessMessage(`Applied ${activeCustomer.tradeInCredit.toFixed(2)} in trade-in credit.`);
  }

  function applyRewardSelection() {
    const reward = rewardCatalog[0];
    if (!reward) {
      return;
    }

    setAppliedReward({
      ...reward,
      mode: redemptionMode
    });
    setIsRedemptionModalOpen(false);
    setSuccessMessage(
      redemptionMode === "points"
        ? `${reward.pointsCost.toLocaleString()} points selected for ${reward.title}.`
        : `${reward.title} will be charged at ${reward.cashCost.toFixed(2)}.`
    );
  }

  async function pairPrinter() {
    if ("bluetooth" in navigator) {
      try {
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true
        });
        setHardwareState((current) => ({
          ...current,
          pairedPrinters: [...current.pairedPrinters, { id: device.id || device.name, name: device.name || "Bluetooth Printer" }]
        }));
        setSuccessMessage("Printer paired successfully.");
        return;
      } catch (error) {
        setSuccessMessage("Printer pairing was cancelled.");
        return;
      }
    }

    setSuccessMessage("Web Bluetooth not available in this browser.");
  }

  async function connectScanner() {
    if ("usb" in navigator) {
      try {
        const device = await navigator.usb.requestDevice({ filters: [] });
        setHardwareState((current) => ({
          ...current,
          pairedScanners: [...current.pairedScanners, { id: String(device.vendorId), name: device.productName || "USB Scanner" }]
        }));
        setSuccessMessage("Barcode scanner connected.");
        return;
      } catch (error) {
        setSuccessMessage("Scanner connection was cancelled.");
        return;
      }
    }

    setSuccessMessage("WebUSB not available in this browser.");
  }

  async function triggerSampleAlert() {
    try {
      const notification = notificationTemplates[0];
      if (!notification) {
        throw new Error("No notification templates available.");
      }
      await showServiceWorkerNotification(notification);
      setSuccessMessage("Notification sent to the device.");
    } catch (error) {
      setSuccessMessage(error.message || "Notification could not be sent.");
    }
  }

  return {
    items,
    paymentMethods,
    associates,
    cart,
    search,
    category,
    platform,
    status,
    successMessage,
    checkoutStep,
    selectedPaymentMethod,
    paymentForm,
    paymentErrors,
    associate,
    isBootstrapping,
    isSubmittingPayment,
    isReadingCard,
    readerResponse,
    manualEntryEnabled,
    customerQuery,
    customerResults,
    isSearchingCustomers,
    activeCustomer,
    isCustomerDrawerOpen,
    customerOrders,
    customerOrderSearch,
    activeReturnSession,
    isRedemptionModalOpen,
    redemptionMode,
    appliedCoupon,
    appliedTradeInCredit: tradeInApplied,
    appliedReward,
    hardwareState,
    isHardwareDrawerOpen,
    syncPendingCount,
    platforms,
    categories,
    filteredItems,
    cartCount,
    subtotal,
    tax,
    total,
    selectedPaymentLabel,
    loyaltyNudge,
    rewardCatalog,
    setSearch,
    setCategory,
    setPlatform,
    setCustomerQuery,
    setCustomerOrderSearch,
    setIsCustomerDrawerOpen,
    setIsRedemptionModalOpen,
    setRedemptionMode,
    setIsHardwareDrawerOpen,
    resetPaymentFlow,
    handleLogin,
    handleLogout,
    addToCart,
    updateQuantity,
    beginCheckout,
    handlePaymentMethodChange,
    handlePaymentFieldChange,
    startCardReaderFlow,
    enableManualEntry,
    submitPayment,
    selectCustomer,
    openCustomerDrawer,
    hydrateReturnSession,
    updateReturnDisposition,
    applyCouponToCart,
    applyTradeCreditToCart,
    applyRewardSelection,
    pairPrinter,
    connectScanner,
    triggerSampleAlert
  };
}

export default usePosStore;
