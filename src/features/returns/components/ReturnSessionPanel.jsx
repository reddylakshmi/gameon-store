import { currency } from "@/utils/formatters/currency";
import { useCustomer } from "@/store/CustomerContext";

function ReturnSessionPanel() {
  const { activeReturnSession, updateReturnDisposition } = useCustomer();

  if (!activeReturnSession) return null;

  const { orderId, orderDate, items } = activeReturnSession;

  return (
    <section className="mb-6 rounded-[1.7rem] border border-amber-400/30 bg-amber-500/5 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Return Session</p>
          <h3 className="mt-2 text-2xl font-bold text-white">Order {orderId}</h3>
          <p className="mt-1 text-sm text-white/60">
            Items within the 30-day window are marked eligible for return.
          </p>
        </div>
        <p className="text-sm font-semibold text-white/70">
          Order Date: {new Date(orderDate).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div
            key={`${orderId}-${item.id}`}
            className={`rounded-2xl border p-4 ${
              item.eligible ? "border-emerald-400/30 bg-emerald-500/5" : "border-white/10 bg-black/20"
            }`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-bold text-white">{item.name}</p>
                <p className="mt-1 text-sm text-white/60">
                  {item.quantity} unit • {currency.format(item.price)}
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${item.eligible ? "text-emerald-200" : "text-red-200"}`}
                >
                  {item.eligible ? "Within 30-day return window" : "Outside 30-day return window"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Disposition</p>
                <label className="flex items-center gap-2 text-sm text-white/75">
                  <input
                    type="radio"
                    checked={item.disposition === "Resellable"}
                    onChange={() => updateReturnDisposition(item.id, "Resellable")}
                  />
                  Resellable
                </label>
                <label className="flex items-center gap-2 text-sm text-white/75">
                  <input
                    type="radio"
                    checked={item.disposition === "Refurbished"}
                    onChange={() => updateReturnDisposition(item.id, "Refurbished")}
                  />
                  Refurbished
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReturnSessionPanel;
