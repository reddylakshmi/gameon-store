function Drawer({ open, title, onClose, children, width = "max-w-xl" }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        className="flex-1"
        aria-label="Close drawer"
        onClick={onClose}
      />
      <aside className={`h-full w-full ${width} overflow-y-auto border-l border-white/10 bg-[#0a0d12] p-6 shadow-2xl`}>
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white">{title}</h2>
          <button
            type="button"
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:border-ember hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export default Drawer;
