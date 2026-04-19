import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { useInventory } from "./InventoryContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { showToast } = useToast();
  const { associate } = useAuth();
  const { items } = useInventory();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!associate) setCart([]);
  }, [associate]);

  const addToCart = useCallback(
    (item) => {
      setCart((current) => {
        const existing = current.find((e) => e.id === item.id);
        const quantityInCart = existing?.quantity ?? 0;

        if (quantityInCart >= item.stockCount) {
          showToast(`Only ${item.stockCount} ${item.name} in stock.`, "info");
          return current;
        }

        if (existing) {
          return current.map((e) =>
            e.id === item.id ? { ...e, quantity: e.quantity + 1 } : e
          );
        }

        return [...current, { ...item, quantity: 1 }];
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (itemId, nextQuantity) => {
      setCart((current) =>
        current.flatMap((entry) => {
          if (entry.id !== itemId) return [entry];
          if (nextQuantity <= 0) return [];
          const sourceItem = items.find((i) => i.id === itemId);
          const clamped = Math.min(nextQuantity, sourceItem?.stockCount ?? nextQuantity);
          return [{ ...entry, quantity: clamped }];
        })
      );
    },
    [items]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({ cart, cartCount, cartSubtotal, addToCart, updateQuantity, clearCart }),
    [cart, cartCount, cartSubtotal, addToCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
