import Drawer from "@/components/ui/Drawer";
import ProgressBar from "@/components/ui/ProgressBar";
import { currency } from "@/utils/formatters/currency";
import { useCustomer } from "@/store/CustomerContext";
import { useLoyalty } from "@/store/LoyaltyContext";

function CustomerDrawer() {
  const {
    activeCustomer,
    isCustomerDrawerOpen,
    customerOrders,
    customerOrderSearch,
    activeReturnSession,
    setIsCustomerDrawerOpen,
    setCustomerOrderSearch,
    hydrateReturnSession
  } = useCustomer();

  const { applyCouponToCart, applyTradeCreditToCart, setIsRedemptionModalOpen } = useLoyalty();

  if (!activeCustomer) return null;

  const filteredOrders = customerOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(customerOrderSearch.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(customerOrderSearch.toLowerCase()))
  );

  return (
    <Drawer
      open={isCustomerDrawerOpen}
      title="Customer Profile"
      onClose={() => setIsCustomerDrawerOpen(false)}
      width="max-w-2xl"
    >
      <div className="space-y-5">
        <section className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-ember">Account State</p>
          <h3 className="mt-2 text-2xl font-bold text-white">{activeCustomer.name}</h3>
          <p className="mt-1 text-sm text-white/60">
            {activeCustomer.email} • {activeCustomer.phone}
          </p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-white/70">
              <span>Points Balance</span>
              <span>
                {activeCustomer.pointsBalance.toLocaleString()} /{" "}
                {activeCustomer.nextRewardPoints.toLocaleString()}
              </span>
            </div>
            <ProgressBar value={activeCustomer.pointsBalance} max={activeCustomer.nextRewardPoints} />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.22em] text-ember">Available Coupons</p>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50 transition hover:text-white"
                onClick={() => setIsRedemptionModalOpen(true)}
              >
                Redemption Modal
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {activeCustomer.coupons.length ? (
                activeCustomer.coupons.map((coupon) => (
                  <button
                    key={coupon.code}
                    type="button"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:border-ember hover:bg-black/35"
                    onClick={() => applyCouponToCart(coupon)}
                  >
                    <p className="font-bold text-white">{coupon.label}</p>
                    <p className="mt-1 text-sm text-white/60">{coupon.code}</p>
                  </button>
                ))
              ) : (
                <p className="text-sm text-white/55">No coupons available for this customer.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-ember">Trade-In Credit</p>
            <p className="mt-2 text-3xl font-black text-white">
              {currency.format(activeCustomer.tradeInCredit)}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Apply available trade-in credit directly to the active cart.
            </p>
            <button
              type="button"
              className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-crimson to-ember text-sm font-black uppercase tracking-[0.16em] text-white transition hover:brightness-110"
              onClick={applyTradeCreditToCart}
            >
              Apply Max Credit
            </button>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-ember">Transaction History</p>
              <p className="mt-2 text-sm text-white/60">
                Click an order to start a return session and flag eligible items.
              </p>
            </div>
            <input
              value={customerOrderSearch}
              onChange={(event) => setCustomerOrderSearch(event.target.value)}
              placeholder="Search orders..."
              className="h-12 rounded-2xl border border-white/10 bg-[#101722] px-4 text-sm text-white outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/30"
            />
          </div>

          <div className="mt-4 space-y-3">
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                  activeReturnSession?.orderId === order.id
                    ? "border-ember bg-crimson/15"
                    : "border-white/10 bg-black/20 hover:border-ember/40"
                }`}
                onClick={() => hydrateReturnSession(order)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{order.id}</p>
                    <p className="mt-1 text-sm text-white/60">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">{currency.format(order.total)}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </Drawer>
  );
}

export default CustomerDrawer;
