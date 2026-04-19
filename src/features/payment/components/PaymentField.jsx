function PaymentField({ label, value, onChange, error, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-14 w-full rounded-2xl border bg-coal px-4 text-base text-white outline-none transition ${
          error
            ? "border-red-400 focus:border-red-300 focus:ring-2 focus:ring-red-300/30"
            : "border-white/10 focus:border-ember focus:ring-2 focus:ring-ember/30"
        }`}
      />
      {error ? <span className="mt-2 block text-sm text-red-300">{error}</span> : null}
    </label>
  );
}

export default PaymentField;
