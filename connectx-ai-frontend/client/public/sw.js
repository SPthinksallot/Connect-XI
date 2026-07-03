self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  
  const options = {
    body: data.body || "New notification",
    icon: "/logo.png",
    badge: "/badge.png",
    vibrate: [100, 50, 100],
    data: data.payload || {},
  };

  event.waitUntil(self.registration.showNotification(data.title || "ConnectX AI", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Focus existing window or open a new one
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const url = "/"; // Target URL
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
