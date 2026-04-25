import { useState, useEffect, useCallback } from "react";
import notificationService from "../services/modules/notificationService";

/**
 * Hook quản lý thông báo: lấy danh sách, đánh dấu đã đọc, gửi mới.
 *
 * Trả về: { notifications, unreadCount, loading, error, refetch, markAsRead, markAllAsRead, sendNotification }
 */
export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // ── Lấy danh sách thông báo ────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Đánh dấu đã đọc ───────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  // ── Đánh dấu tất cả đã đọc (cập nhật local) ──────────────────────
  const markAllAsRead = useCallback(async () => {
    try {
      // Gọi API cho từng thông báo chưa đọc
      const unread = notifications.filter((n) => n.unread);
      await Promise.all(unread.map((n) => notificationService.markAsRead(n.id)));
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, unread: false }))
      );
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [notifications]);

  // ── Gửi thông báo mới ──────────────────────────────────────────────
  const sendNotification = useCallback(async (payload) => {
    try {
      await notificationService.sendNotification(payload);
      await fetchNotifications();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    sendNotification,
  };
}
