import { useState, useEffect, useCallback } from "react";
import householdService from "../services/modules/householdService";

/**
 * Hook quản lý hộ gia đình: lấy thông tin, cập nhật, quản lý thành viên.
 *
 * Trả về: { household, loading, error, refetch, updateHousehold, addMember, removeMember, inviteMember, changeRole }
 */
export default function useHousehold(idOrName) {
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lấy thông tin hộ gia đình ──────────────────────────────────────
  const fetchHousehold = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Nếu không truyền ID, mặc định lấy "me" (bootstrap tự động)
      const data = await householdService.getMyHousehold();
      setHousehold(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHousehold();
  }, [fetchHousehold]);

  // ── Cập nhật hộ gia đình ───────────────────────────────────────────
  const updateHousehold = useCallback(async (id, payload) => {
    try {
      await householdService.updateHousehold(id, payload);
      await fetchHousehold();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchHousehold]);

  // ── Thêm thành viên ────────────────────────────────────────────────
  const addMember = useCallback(async (id, userId) => {
    try {
      await householdService.addMember(id, userId);
      await fetchHousehold();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchHousehold]);

  // ── Xoá thành viên ─────────────────────────────────────────────────
  const removeMember = useCallback(async (id, userId) => {
    try {
      await householdService.removeMember(id, userId);
      await fetchHousehold();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchHousehold]);

  // ── Mời thành viên ─────────────────────────────────────────────────
  const inviteMember = useCallback(async (payload) => {
    try {
      await householdService.inviteMember(payload);
      await fetchHousehold();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchHousehold]);

  // ── Đổi vai trò ────────────────────────────────────────────────────
  const changeRole = useCallback(async (memberId, payload) => {
    try {
      await householdService.changeRole(memberId, payload);
      await fetchHousehold();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchHousehold]);

  return {
    household,
    loading,
    error,
    refetch: fetchHousehold,
    updateHousehold,
    addMember,
    removeMember,
    inviteMember,
    changeRole,
  };
}
