import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  addQueuedTransaction,
  getQueuedTransactions,
  removeQueuedTransaction
} from "@/lib/storage/offlineQueue";
import { submitCheckout } from "@/services/checkout/paymentService";
import { loadHardwareState } from "@/services/device/deviceService";
import { loadNotificationTemplates, showServiceWorkerNotification } from "@/services/notifications/notificationService";
import { useToast } from "./ToastContext";

const HardwareContext = createContext(null);

export function HardwareProvider({ children }) {
  const { showToast } = useToast();

  const [hardwareState, setHardwareState] = useState({ pairedPrinters: [], pairedScanners: [] });
  const [isHardwareDrawerOpen, setIsHardwareDrawerOpen] = useState(false);
  const [notificationTemplates, setNotificationTemplates] = useState([]);
  const [syncPendingCount, setSyncPendingCount] = useState(0);

  useEffect(() => {
    Promise.all([loadHardwareState(), loadNotificationTemplates(), getQueuedTransactions()])
      .then(([hardware, notifications, queued]) => {
        setHardwareState(hardware);
        setNotificationTemplates(notifications);
        setSyncPendingCount(queued.length);
      })
      .catch(() => showToast("Hardware initialization failed.", "error"));
  }, [showToast]);

  // Sync offline queue when connectivity is restored
  useEffect(() => {
    async function syncQueue() {
      if (!navigator.onLine) return;
      const queued = await getQueuedTransactions();
      if (!queued.length) {
        setSyncPendingCount(0);
        return;
      }

      let synced = 0;
      for (const entry of queued) {
        try {
          await submitCheckout(entry.payload);
          await removeQueuedTransaction(entry.id);
          synced++;
        } catch {
          // leave failed entries in the queue for the next sync attempt
        }
      }

      setSyncPendingCount(queued.length - synced);
      if (synced > 0) {
        showToast(
          `${synced} offline transaction${synced > 1 ? "s" : ""} synced.`,
          "success"
        );
      }
    }

    window.addEventListener("online", syncQueue);
    return () => window.removeEventListener("online", syncQueue);
  }, [showToast]);

  const enqueueTransaction = useCallback(async (payload) => {
    await addQueuedTransaction({ id: `queue-${Date.now()}`, payload });
    setSyncPendingCount((c) => c + 1);
  }, []);

  const pairPrinter = useCallback(async () => {
    if (!("bluetooth" in navigator)) {
      showToast("Web Bluetooth not available in this browser.", "error");
      return;
    }
    try {
      const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
      setHardwareState((current) => ({
        ...current,
        pairedPrinters: [
          ...current.pairedPrinters,
          { id: device.id || device.name, name: device.name || "Bluetooth Printer" }
        ]
      }));
      showToast("Printer paired successfully.", "success");
    } catch {
      showToast("Printer pairing was cancelled.", "info");
    }
  }, [showToast]);

  const connectScanner = useCallback(async () => {
    if (!("usb" in navigator)) {
      showToast("WebUSB not available in this browser.", "error");
      return;
    }
    try {
      const device = await navigator.usb.requestDevice({ filters: [] });
      setHardwareState((current) => ({
        ...current,
        pairedScanners: [
          ...current.pairedScanners,
          { id: String(device.vendorId), name: device.productName || "USB Scanner" }
        ]
      }));
      showToast("Barcode scanner connected.", "success");
    } catch {
      showToast("Scanner connection was cancelled.", "info");
    }
  }, [showToast]);

  const triggerSampleAlert = useCallback(async () => {
    const notification = notificationTemplates[0];
    if (!notification) {
      showToast("No notification templates available.", "error");
      return;
    }
    try {
      await showServiceWorkerNotification(notification);
      showToast("Notification sent to the device.", "success");
    } catch (error) {
      showToast(error.message || "Notification could not be sent.", "error");
    }
  }, [notificationTemplates, showToast]);

  const value = useMemo(
    () => ({
      hardwareState,
      isHardwareDrawerOpen,
      syncPendingCount,
      setIsHardwareDrawerOpen,
      enqueueTransaction,
      pairPrinter,
      connectScanner,
      triggerSampleAlert
    }),
    [
      hardwareState, isHardwareDrawerOpen, syncPendingCount,
      enqueueTransaction, pairPrinter, connectScanner, triggerSampleAlert
    ]
  );

  return <HardwareContext.Provider value={value}>{children}</HardwareContext.Provider>;
}

export function useHardware() {
  return useContext(HardwareContext);
}
