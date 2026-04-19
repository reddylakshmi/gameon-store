import { appConfig } from "@/config/appConfig";
import CartPanel from "@/features/cart/components/CartPanel";
import CustomerDrawer from "@/features/customer/components/CustomerDrawer";
import RedemptionModal from "@/features/customer/components/RedemptionModal";
import HardwareSettingsDrawer from "@/features/hardware/components/HardwareSettingsDrawer";
import GlobalHeader from "@/features/header/components/GlobalHeader";
import InventoryGrid from "@/features/inventory/components/InventoryGrid";
import InventoryToolbar from "@/features/inventory/components/InventoryToolbar";
import NudgeFooter from "@/features/loyalty/components/NudgeFooter";
import PaymentScreen from "@/features/payment/components/PaymentScreen";
import PaymentSummaryPanel from "@/features/payment/components/PaymentSummaryPanel";
import ReturnSessionPanel from "@/features/returns/components/ReturnSessionPanel";
import { useAuth } from "@/store/AuthContext";
import { useCart } from "@/store/CartContext";
import { useInventory } from "@/store/InventoryContext";
import { usePayment } from "@/store/PaymentContext";

function PosPage() {
  const { associate, logout } = useAuth();
  const { status } = useInventory();
  const { checkoutStep } = usePayment();

  return (
    <div className="min-h-screen bg-transparent text-frost pb-20">
      <GlobalHeader />

      {checkoutStep === "payment" ? (
        <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[1.45fr_0.75fr] lg:px-8">
          <PaymentScreen />
          <PaymentSummaryPanel />
        </div>
      ) : (
        <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8">
          <main className="flex-1 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-glow backdrop-blur sm:p-6">
            <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-ember">Retail Command</p>
                  <h1 className="text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
                    {appConfig.storeName}
                  </h1>
                  <p className="mt-2 text-sm text-white/65">
                    Signed in as {associate.name} ({associate.id})
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="rounded-2xl border border-ember/40 bg-black/35 px-4 py-3 text-sm text-white/80">
                    <p>{status}</p>
                  </div>
                  <button
                    type="button"
                    className="h-12 rounded-2xl border border-white/10 px-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:border-ember hover:text-white"
                    onClick={logout}
                  >
                    Log Out
                  </button>
                </div>
              </div>

              <InventoryToolbar />
            </header>

            <ReturnSessionPanel />

            <InventorySectionHeader />

            <InventoryGrid />
          </main>

          <aside className="w-full rounded-[2rem] border border-white/10 bg-[#090b10]/95 p-4 shadow-glow backdrop-blur sm:p-6 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:w-[24rem]">
            <CartPanel />
          </aside>
        </div>
      )}

      <CustomerDrawer />
      <RedemptionModal />
      <HardwareSettingsDrawer />
      <NudgeFooter />
    </div>
  );
}

function InventorySectionHeader() {
  const { filteredItems } = useInventory();
  const { cart } = useCart();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <section className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-[0.14em] text-white">Inventory Grid</h2>
        <p className="text-sm text-white/60">
          {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"} visible
        </p>
      </div>
      <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70">
        Cart Units: {cartCount}
      </div>
    </section>
  );
}

export default PosPage;
