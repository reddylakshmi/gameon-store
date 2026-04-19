import { useLoyalty } from "@/store/LoyaltyContext";

function NudgeFooter() {
  const { loyaltyNudge } = useLoyalty();

  if (!loyaltyNudge) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-ember/30 bg-[#0a0e13]/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto max-w-7xl text-sm font-semibold text-white">
        {loyaltyNudge.message}
      </div>
    </div>
  );
}

export default NudgeFooter;
