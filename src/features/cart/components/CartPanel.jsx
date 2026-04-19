import { appConfig } from "@/config/appConfig";
import { currency } from "@/utils/formatters/currency";
import { useCart } from "@/store/CartContext";
import { useLoyalty } from "@/store/LoyaltyContext";
import { usePayment } from "@/store/PaymentContext";

function CartPanel() {
  const { cart, cartCount, updateQuantity } = useCart();
  const { subtotal, tax, total } = useLoyalty();
  const { beginCheckout } = usePayment();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-ember">Smart Cart</p>
          <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white">Current Sale</h2>
        </div>
        <div className="rounded-full bg-crimson px-3 py-2 text-sm font-semibold text-white">
          {cartCount} units
        </div>
      </div>

      <div className="scrollbar-thin mb-5 flex-1 space-y-3 overflow-y-auto pr-1">
        {cart.length ? (
          cart.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <p className="text-sm text-white/65">{item.platform}</p>
                </div>
                <p className="text-lg font-bold text-white">{currency.format(item.price)}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/40 text-xl font-bold text-white transition hover:border-ember hover:text-ember"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <div className="flex h-12 min-w-14 items-center justify-center rounded-2xl bg-white/10 px-4 text-lg font-bold text-white">
                    {item.quantity}
                  </div>
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/40 text-xl font-bold text-white transition hover:border-ember hover:text-ember"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stockCount}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="h-12 rounded-2xl border border-white/10 px-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:border-ember hover:text-white"
                  onClick={() => updateQuantity(item.id, 0)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.7rem] border border-dashed border-white/15 bg-white/5 p-6 text-center text-white/60">
            Start a transaction by adding inventory from the left panel.
          </div>
        )}
      </div>

      <div className="rounded-[1.7rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5">
        <div className="space-y-3 text-sm text-white/75">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{currency.format(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax ({(appConfig.taxRate * 100).toFixed(2)}%)</span>
            <span>{currency.format(tax)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xl font-black text-white">
            <span>Total</span>
            <span>{currency.format(total)}</span>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 flex h-16 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-crimson to-ember px-4 text-lg font-black uppercase tracking-[0.16em] text-white transition hover:brightness-110"
          onClick={beginCheckout}
        >
          Check Out
        </button>
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/45">
        Offline-ready after first load. Install from the browser menu for counter use.
      </p>
    </div>
  );
}

export default CartPanel;
