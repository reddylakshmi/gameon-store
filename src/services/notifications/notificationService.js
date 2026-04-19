import { apiConfig } from "../../config/apiConfig";
import { request } from "../../lib/http/httpClient";

let notificationCache = null;

export async function loadNotificationTemplates() {
  if (!apiConfig.useMockData) {
    return request(`${apiConfig.endpoints.bootstrap}/notifications`);
  }

  if (!notificationCache) {
    notificationCache = request(apiConfig.mockEndpoints.notifications, { headers: {} });
  }

  return notificationCache;
}

export async function showServiceWorkerNotification(notification) {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported in this browser.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({
    type: "SHOW_NOTIFICATION",
    payload: notification
  });

  return true;
}
