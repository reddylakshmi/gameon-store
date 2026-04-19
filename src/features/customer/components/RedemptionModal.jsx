import Modal from "@/components/ui/Modal";
import { currency } from "@/utils/formatters/currency";
import { useLoyalty } from "@/store/LoyaltyContext";

function RedemptionModal() {
  const {
    rewardCatalog,
    isRedemptionModalOpen,
    redemptionMode,
    setIsRedemptionModalOpen,
    setRedemptionMode,
    applyRewardSelection
  } = useLoyalty();

  const reward = rewardCatalog[0];

  if (!reward) return null;

  return (
    <Modal
      open={isRedemptionModalOpen}
      title="Reward Redemption"
      onClose={() => setIsRedemptionModalOpen(false)}
    >
      <div className="space-y-5">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-ember">Redemption Choice</p>
          <h3 className="mt-2 text-2xl font-bold text-white">{reward.title}</h3>
          <p className="mt-2 text-sm text-white/60">{reward.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            className={`rounded-[1.5rem] border p-5 text-left transition ${
              redemptionMode === "cash" ? "border-ember bg-crimson/15" : "border-white/10 bg-black/20"
            }`}
            onClick={() => setRedemptionMode("cash")}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-white/55">Cash</p>
            <p className="mt-2 text-2xl font-black text-white">Pay {currency.format(reward.cashCost)}</p>
          </button>

          <button
            type="button"
            className={`rounded-[1.5rem] border p-5 text-left transition ${
              redemptionMode === "points" ? "border-ember bg-crimson/15" : "border-white/10 bg-black/20"
            }`}
            onClick={() => setRedemptionMode("points")}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-white/55">Points</p>
            <p className="mt-2 text-2xl font-black text-white">
              Use {reward.pointsCost.toLocaleString()} Points
            </p>
          </button>
        </div>

        <button
          type="button"
          className="flex h-16 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-crimson to-ember text-lg font-black uppercase tracking-[0.16em] text-white transition hover:brightness-110"
          onClick={() => applyRewardSelection(reward)}
        >
          Apply Redemption
        </button>
      </div>
    </Modal>
  );
}

export default RedemptionModal;
