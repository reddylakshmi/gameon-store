import Drawer from "@/components/ui/Drawer";
import { useHardware } from "@/store/HardwareContext";

function HardwareSettingsDrawer() {
  const { hardwareState, isHardwareDrawerOpen, setIsHardwareDrawerOpen, pairPrinter, connectScanner } =
    useHardware();

  return (
    <Drawer open={isHardwareDrawerOpen} title="Hardware Bridge" onClose={() => setIsHardwareDrawerOpen(false)}>
      <div className="space-y-5">
        <section className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-ember">Bluetooth Receipt Printer</p>
          <p className="mt-2 text-sm text-white/60">
            Pair a receipt printer using Web Bluetooth for handheld or countertop checkout.
          </p>
          <button
            type="button"
            className="mt-4 flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-crimson to-ember px-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:brightness-110"
            onClick={pairPrinter}
          >
            Pair Printer
          </button>
          <div className="mt-4 space-y-2">
            {hardwareState.pairedPrinters.map((printer) => (
              <div
                key={printer.id}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75"
              >
                {printer.name}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-ember">USB Barcode Scanner</p>
          <p className="mt-2 text-sm text-white/60">
            Connect a handheld USB scanner using WebUSB-compatible browsers.
          </p>
          <button
            type="button"
            className="mt-4 flex h-14 items-center justify-center rounded-2xl border border-white/10 px-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:border-ember hover:text-white"
            onClick={connectScanner}
          >
            Connect Scanner
          </button>
          <div className="mt-4 space-y-2">
            {hardwareState.pairedScanners.map((scanner) => (
              <div
                key={scanner.id}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75"
              >
                {scanner.name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Drawer>
  );
}

export default HardwareSettingsDrawer;
