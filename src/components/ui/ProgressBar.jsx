function ProgressBar({ value, max }) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ember to-crimson"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/55">{percent}% to next reward</p>
    </div>
  );
}

export default ProgressBar;
