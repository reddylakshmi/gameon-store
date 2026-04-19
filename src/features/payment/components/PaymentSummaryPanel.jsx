import { appConfig } from "@/config/appConfig";
import { currency } from "@/utils/formatters/currency";
import { useCart } from "@/store/CartContext";
import { useLoyalty } from "@/store/LoyaltyContext";

function PaymentSummaryPanel() {
  const { cart, cartCount } = useCart();
  const { subtotal, tax, total } = useLoyalty();

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-[#090b10]/95 p-4 shadow-glow backdrop-blur sm:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-ember">Order Summary</p>
          <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white">Review Sale</h2>
        </div>
        <div className="rounded-full bg-crimson px-3 py-2 text-sm font-semibold text-white">
          {cartCount} units
        </div>
      </div>

      <div className="scrollbar-thin mb-5 flex-1 space-y-3 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">{item.name}</h3>
                <p className="text-sm text-white/65">
                  {item.platform} x {item.quantity}
                </p>
              </div>
              <p className="text-lg font-bold text-white">
                {currency.format(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
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
            <span>Total Due</span>
            <span>{currency.format(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSummaryPanel;
