function Modal({ open, title, onClose, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0b0f14] p-6 shadow-2xl">
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
      </div>
    </div>
  );
}

export default Modal;
