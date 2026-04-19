import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { getCustomerOrders, searchCustomers } from "@/services/customer/customerService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const { showToast } = useToast();
  const { associate } = useAuth();

  const [customerQuery, setCustomerQuery] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerOrderSearch, setCustomerOrderSearch] = useState("");
  const [activeReturnSession, setActiveReturnSession] = useState(null);

  const debouncedQuery = useDebouncedValue(customerQuery, 350);

  useEffect(() => {
    if (!associate) {
      setActiveCustomer(null);
      setCustomerResults([]);
      setCustomerQuery("");
      setCustomerOrders([]);
      setActiveReturnSession(null);
      setIsCustomerDrawerOpen(false);
    }
  }, [associate]);

  useEffect(() => {
    async function lookup() {
      if (!debouncedQuery.trim()) {
        setCustomerResults([]);
        return;
      }
      setIsSearchingCustomers(true);
      try {
        const results = await searchCustomers(debouncedQuery);
        setCustomerResults(results);
      } finally {
        setIsSearchingCustomers(false);
      }
    }
    lookup();
  }, [debouncedQuery]);

  const selectCustomer = useCallback(
    async (customer) => {
      setActiveCustomer(customer);
      setIsCustomerDrawerOpen(true);
      setCustomerQuery(customer.email);
      setCustomerResults([]);
      const orders = await getCustomerOrders(customer.id);
      setCustomerOrders(orders);
      showToast(`Customer ${customer.name} attached to active cart.`, "info");
    },
    [showToast]
  );

  const openCustomerDrawer = useCallback(() => {
    if (activeCustomer) setIsCustomerDrawerOpen(true);
  }, [activeCustomer]);

  const hydrateReturnSession = useCallback(
    (order) => {
      const sessionItems = order.items.map((item) => {
        const eligible =
          Date.now() - new Date(order.orderDate).getTime() <= 30 * 24 * 60 * 60 * 1000;
        return { ...item, eligible, disposition: "Resellable" };
      });
      setActiveReturnSession({ orderId: order.id, orderDate: order.orderDate, items: sessionItems });
      showToast(`Return session started from ${order.id}.`, "info");
    },
    [showToast]
  );

  const updateReturnDisposition = useCallback((itemId, disposition) => {
    setActiveReturnSession((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, disposition } : item
      )
    }));
  }, []);

  const value = useMemo(
    () => ({
      customerQuery,
      customerResults,
      isSearchingCustomers,
      activeCustomer,
      isCustomerDrawerOpen,
      customerOrders,
      customerOrderSearch,
      activeReturnSession,
      setCustomerQuery,
      setCustomerOrderSearch,
      setIsCustomerDrawerOpen,
      selectCustomer,
      openCustomerDrawer,
      hydrateReturnSession,
      updateReturnDisposition
    }),
    [
      customerQuery, customerResults, isSearchingCustomers, activeCustomer,
      isCustomerDrawerOpen, customerOrders, customerOrderSearch, activeReturnSession,
      selectCustomer, openCustomerDrawer, hydrateReturnSession, updateReturnDisposition
    ]
  );

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  return useContext(CustomerContext);
}
