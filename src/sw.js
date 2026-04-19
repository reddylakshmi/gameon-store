import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";

clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "gameon-pages"
  })
);

registerRoute(
  ({ request, url }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker" ||
    request.destination === "image" ||
    url.pathname === "/manifest.json",
  new CacheFirst({
    cacheName: "gameon-assets"
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/mock-data/"),
  new NetworkFirst({
    cacheName: "gameon-mock-data"
  })
);

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (event.data?.type === "SHOW_NOTIFICATION") {
    const payload = event.data.payload;
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: "/icons/icon-192.svg",
      badge: "/icons/icon-192.svg"
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow("/");
    })
  );
});
