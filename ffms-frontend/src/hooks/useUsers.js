import { useState, useEffect, useCallback } from "react";
import userService from "../services/modules/userService";

/**
 * Hook tuỳ chỉnh đóng gói toàn bộ logic API liên quan đến người dùng.
 *
 * Trả về: { users, loading, error, refetch, createUser, updateUser, deleteUser }
 */
export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lấy danh sách người dùng ───────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      // Tuỳ chỉnh theo cấu trúc API: data có thể là mảng hoặc { data: [...] }
      setUsers(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Tạo mới ────────────────────────────────────────────────────────
  const createUser = useCallback(
    async (payload) => {
      try {
        await userService.createUser(payload);
        await fetchUsers(); // làm mới danh sách
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
        throw err; // cho phép caller xử lý thêm
      }
    },
    [fetchUsers]
  );

  // ── Cập nhật ───────────────────────────────────────────────────────
  const updateUser = useCallback(
    async (id, payload) => {
      try {
        await userService.updateUser(id, payload);
        await fetchUsers();
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
        throw err;
      }
    },
    [fetchUsers]
  );

  // ── Xoá ────────────────────────────────────────────────────────────
  const deleteUser = useCallback(
    async (id) => {
      try {
        await userService.deleteUser(id);
        await fetchUsers();
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
        throw err;
      }
    },
    [fetchUsers]
  );

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
