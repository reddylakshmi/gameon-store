import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useBootstrapData from "@/hooks/useBootstrapData";
import { useAuth } from "./AuthContext";

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const { associate } = useAuth();
  const { inventory, paymentMethods, associates, isBootstrapping, bootstrapError } = useBootstrapData();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [platform, setPlatform] = useState("All Platforms");
  const [status, setStatus] = useState("Loading inventory...");

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
    if (associate) {
      setStatus(`Associate ${associate.id} signed in. ${items.length || "All"} products ready.`);
    } else {
      setStatus("Associate signed out.");
    }
  }, [associate]); // eslint-disable-line react-hooks/exhaustive-deps

  const decrementStock = useCallback((soldItems) => {
    setItems((current) =>
      current.map((item) => ({
        ...item,
        stockCount: Math.max(item.stockCount - (soldItems.get(item.id) ?? 0), 0)
      }))
    );
  }, []);

  const markCheckoutComplete = useCallback(() => {
    setStatus(`Last checkout closed at ${new Date().toLocaleTimeString()}.`);
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
      const q = search.toLowerCase();
      const searchMatch =
        item.name.toLowerCase().includes(q) ||
        item.platform.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return (
        searchMatch &&
        (category === "All" || item.category === category) &&
        (platform === "All Platforms" || item.platform === platform)
      );
    });
  }, [items, search, category, platform]);

  const value = useMemo(
    () => ({
      items,
      paymentMethods,
      associates,
      isBootstrapping,
      bootstrapError,
      status,
      search,
      category,
      platform,
      platforms,
      categories,
      filteredItems,
      setSearch,
      setCategory,
      setPlatform,
      decrementStock,
      markCheckoutComplete
    }),
    [
      items, paymentMethods, associates, isBootstrapping, bootstrapError,
      status, search, category, platform, platforms, categories, filteredItems,
      decrementStock, markCheckoutComplete
    ]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
