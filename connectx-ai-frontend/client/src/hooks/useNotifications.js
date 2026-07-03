import { useEffect, useCallback } from "react";
import { notificationApi } from "../api/messageApi";

/**
 * useNotifications — requests browser push permission and
 * registers the service worker for Web Push.
 */
export const useNotifications = () => {
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    // Register service worker
    if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!vapidKey) return;

        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        await notificationApi.markAllRead; // warm up the API module
        // Save subscription to server
        const { authApi } = await import("../api/authApi");
        await authApi.default.post("/auth/push-subscribe", { subscription });
      } catch (err) {
        console.warn("Push registration failed:", err);
      }
    }
  }, []);

  /**
   * Show an in-app notification (when the tab is focused).
   */
  const showInAppNotification = useCallback((title, body) => {
    if (Notification.permission === "granted" && document.hidden) {
      new Notification(title, { body, icon: "/logo.png" });
    }
  }, []);

  useEffect(() => {
    // Auto-request on mount
    requestPermission();
  }, [requestPermission]);

  return { requestPermission, showInAppNotification };
};

// Helper: convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
