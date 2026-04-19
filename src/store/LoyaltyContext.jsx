import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { appConfig } from "@/config/appConfig";
import { loadRewards } from "@/services/loyalty/loyaltyService";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useCustomer } from "./CustomerContext";
import { useInventory } from "./InventoryContext";
import { useToast } from "./ToastContext";

const LoyaltyContext = createContext(null);

export function LoyaltyProvider({ children }) {
  const { showToast } = useToast();
  const { associate } = useAuth();
  const { cartSubtotal } = useCart();
  const { activeCustomer } = useCustomer();
  const { items } = useInventory();

  const [rewardCatalog, setRewardCatalog] = useState([]);
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false);
  const [redemptionMode, setRedemptionMode] = useState("cash");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [appliedTradeInCredit, setAppliedTradeInCredit] = useState(0);
  const [appliedReward, setAppliedReward] = useState(null);

  useEffect(() => {
    loadRewards()
      .then(setRewardCatalog)
      .catch(() => showToast("Could not load reward catalog.", "error"));
  }, [showToast]);

  // Reset discounts when customer changes or associate logs out
  useEffect(() => {
    setAppliedCoupon(null);
    setAppliedTradeInCredit(0);
    setAppliedReward(null);
  }, [activeCustomer, associate]);

  const rewardCashCharge = appliedReward?.mode === "cash" ? appliedReward.cashCost : 0;
  const subtotal = cartSubtotal + rewardCashCharge;
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const tradeInApplied = Math.min(appliedTradeInCredit, Math.max(0, subtotal - couponDiscount));
  const rewardDiscount = appliedReward?.mode === "points" ? appliedReward.cashCost : 0;
  const adjustedSubtotal = Math.max(0, subtotal - couponDiscount - tradeInApplied - rewardDiscount);
  const tax = adjustedSubtotal * appConfig.taxRate;
  const total = adjustedSubtotal + tax;

  const loyaltyNudge = useMemo(() => {
    if (!activeCustomer) return null;
    const usedGame = items.find(
      (item) => item.category === "Game" && item.price <= 20 && item.stockCount > 0
    );
    if (!usedGame) return null;
    return {
      targetPrice: usedGame.price,
      message: `Add ${usedGame.name} for ${usedGame.price.toFixed(2)} to push ${activeCustomer.name} toward the next reward today.`
    };
  }, [activeCustomer, items]);

  const applyCouponToCart = useCallback(
    (coupon) => {
      setAppliedCoupon(coupon);
      showToast(`${coupon.code} applied to the active cart.`, "success");
    },
    [showToast]
  );

  const applyTradeCreditToCart = useCallback(() => {
    if (!activeCustomer) return;
    setAppliedTradeInCredit(activeCustomer.tradeInCredit);
    showToast(`Applied $${activeCustomer.tradeInCredit.toFixed(2)} in trade-in credit.`, "success");
  }, [activeCustomer, showToast]);

  // reward is passed explicitly so any item in the catalog can be applied, not just index 0
  const applyRewardSelection = useCallback(
    (reward) => {
      if (!reward) return;
      setAppliedReward({ ...reward, mode: redemptionMode });
      setIsRedemptionModalOpen(false);
      showToast(
        redemptionMode === "points"
          ? `${reward.pointsCost.toLocaleString()} points selected for ${reward.title}.`
          : `${reward.title} will be charged at $${reward.cashCost.toFixed(2)}.`,
        "success"
      );
    },
    [redemptionMode, showToast]
  );

  const resetDiscounts = useCallback(() => {
    setAppliedCoupon(null);
    setAppliedTradeInCredit(0);
    setAppliedReward(null);
  }, []);

  const value = useMemo(
    () => ({
      rewardCatalog,
      isRedemptionModalOpen,
      redemptionMode,
      appliedCoupon,
      appliedTradeInCredit: tradeInApplied,
      appliedReward,
      subtotal,
      tax,
      total,
      loyaltyNudge,
      setIsRedemptionModalOpen,
      setRedemptionMode,
      applyCouponToCart,
      applyTradeCreditToCart,
      applyRewardSelection,
      resetDiscounts
    }),
    [
      rewardCatalog, isRedemptionModalOpen, redemptionMode, appliedCoupon,
      tradeInApplied, appliedReward, subtotal, tax, total, loyaltyNudge,
      applyCouponToCart, applyTradeCreditToCart, applyRewardSelection, resetDiscounts
    ]
  );

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>;
}

export function useLoyalty() {
  return useContext(LoyaltyContext);
}
