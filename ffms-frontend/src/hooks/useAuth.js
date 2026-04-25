import { useState, useCallback } from "react";
import authService from "../services/modules/authService";

/**
 * Hook quản lý xác thực: đăng nhập, đăng ký, lấy thông tin, đăng xuất.
 *
 * Trả về: { user, loading, error, login, register, getMe, logout }
 */
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Đăng nhập ──────────────────────────────────────────────────────
  const login = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      const userData = response?.data?.user || response?.user || response;
      setUser(userData);
      return response;
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Đăng ký ────────────────────────────────────────────────────────
  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      return response;
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Lấy thông tin người dùng hiện tại ──────────────────────────────
  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getMe();
      setUser(response?.data?.user || response?.data || response?.user || response);
      return response;
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Đăng xuất ──────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("[Logout Error]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, register, getMe, logout };
}
