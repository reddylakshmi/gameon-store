import { currency } from "@/utils/formatters/currency";
import { useCustomer } from "@/store/CustomerContext";
import { useHardware } from "@/store/HardwareContext";
import { useLoyalty } from "@/store/LoyaltyContext";

function GlobalHeader() {
  const {
    customerQuery,
    customerResults,
    isSearchingCustomers,
    activeCustomer,
    setCustomerQuery,
    selectCustomer,
    openCustomerDrawer
  } = useCustomer();

  const { syncPendingCount, setIsHardwareDrawerOpen, triggerSampleAlert } = useHardware();
  const { loyaltyNudge } = useLoyalty();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b11]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                Customer Lookup
              </span>
              <input
                value={customerQuery}
                onChange={(event) => setCustomerQuery(event.target.value)}
                placeholder="Search by customer phone or email..."
                className="h-14 w-full rounded-2xl border border-white/10 bg-[#101722] px-4 text-base text-white outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/30"
              />
            </label>

            {(customerQuery || customerResults.length > 0 || isSearchingCustomers) && (
              <div className="absolute left-0 right-0 top-[5.7rem] rounded-[1.4rem] border border-white/10 bg-[#0c121b] p-3 shadow-2xl">
                {isSearchingCustomers ? (
                  <p className="px-2 py-3 text-sm text-white/65">Searching customers...</p>
                ) : customerResults.length ? (
                  customerResults.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-white/5"
                      onClick={() => selectCustomer(customer)}
                    >
                      <div>
                        <p className="font-bold text-white">{customer.name}</p>
                        <p className="text-sm text-white/60">{customer.email}</p>
                      </div>
                      <p className="text-sm text-white/45">{customer.phone}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-2 py-3 text-sm text-white/65">No customers found.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/75">
              Sync Pending: <span className="font-bold text-white">{syncPendingCount}</span>
            </div>
            <button
              type="button"
              className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-ember hover:text-white"
              onClick={triggerSampleAlert}
            >
              Push Alert
            </button>
            <button
              type="button"
              className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-ember hover:text-white"
              onClick={() => setIsHardwareDrawerOpen(true)}
            >
              Hardware
            </button>
            <button
              type="button"
              className="rounded-2xl bg-crimson px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-ember"
              onClick={openCustomerDrawer}
              disabled={!activeCustomer}
            >
              {activeCustomer ? "Customer Account" : "No Customer"}
            </button>
          </div>
        </div>

        {loyaltyNudge ? (
          <div className="flex flex-col gap-2 rounded-[1.5rem] border border-ember/30 bg-gradient-to-r from-crimson/20 to-transparent px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-ember">Loyalty Nudge</p>
              <p className="mt-1 text-sm text-white">{loyaltyNudge.message}</p>
            </div>
            <p className="text-sm font-semibold text-white">{currency.format(loyaltyNudge.targetPrice)}</p>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default GlobalHeader;
