import { useToast } from "@/store/ToastContext";

const typeStyles = {
  success: {
    border: "border-ember/50",
    bg: "bg-[#12060a]/95",
    label: "text-ember",
    labelText: "Success"
  },
  error: {
    border: "border-red-500/50",
    bg: "bg-[#120606]/95",
    label: "text-red-400",
    labelText: "Error"
  },
  info: {
    border: "border-blue-400/40",
    bg: "bg-[#060a12]/95",
    label: "text-blue-300",
    labelText: "Notice"
  }
};

function Toast() {
  const { toast } = useToast();

  if (!toast) return null;

  const styles = typeStyles[toast.type] ?? typeStyles.success;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 pt-6 sm:items-center">
      <div
        className={`w-full max-w-md rounded-[1.8rem] border ${styles.border} ${styles.bg} p-5 text-center shadow-glow backdrop-blur`}
      >
        <p className={`text-sm uppercase tracking-[0.3em] ${styles.label}`}>{styles.labelText}</p>
        <p className="mt-3 text-xl font-bold text-white">{toast.message}</p>
      </div>
    </div>
  );
}

export default Toast;
