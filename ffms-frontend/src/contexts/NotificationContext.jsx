import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import notificationService from "../services/modules/notificationService";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Lấy thông báo từ API ────────────────────────────────────────────
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(Array.isArray(data) ? data : data?.data ?? []);
      } catch (err) {
        console.error("[NotificationContext] Lỗi khi lấy thông báo:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications]
  );

  // ── Đánh dấu tất cả đã đọc ────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    try {
      const unread = notifications.filter((item) => item.unread);
      await Promise.all(unread.map((item) => notificationService.markAsRead(item.id)));
      setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    } catch (err) {
      console.error("[NotificationContext] Lỗi khi đánh dấu đã đọc:", err);
    }
  }, [notifications]);

  // ── Đánh dấu một thông báo đã đọc ──────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
      );
    } catch (err) {
      console.error("[NotificationContext] Lỗi khi đánh dấu đã đọc:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      dropdownOpen,
      setDropdownOpen,
      markAllAsRead,
      markAsRead,
    }),
    [notifications, unreadCount, loading, dropdownOpen, markAllAsRead, markAsRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
