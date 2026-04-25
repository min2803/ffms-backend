import { useState, useEffect, useCallback } from "react";
import incomeService from "../services/modules/incomeService";

/**
 * Hook quản lý thu nhập: lấy danh sách, thêm, cập nhật, xoá.
 *
 * Trả về: { incomes, loading, error, refetch, addIncome, updateIncome, deleteIncome }
 */
export default function useIncome(params = {}) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lấy danh sách thu nhập ─────────────────────────────────────────
  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await incomeService.getIncomes(params);
      setIncomes(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  // ── Thêm mới ──────────────────────────────────────────────────────
  const addIncome = useCallback(async (payload) => {
    try {
      await incomeService.addIncome(payload);
      await fetchIncomes();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchIncomes]);

  // ── Cập nhật ───────────────────────────────────────────────────────
  const updateIncome = useCallback(async (id, payload) => {
    try {
      await incomeService.updateIncome(id, payload);
      await fetchIncomes();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchIncomes]);

  // ── Xoá ────────────────────────────────────────────────────────────
  const deleteIncome = useCallback(async (id) => {
    try {
      await incomeService.deleteIncome(id);
      await fetchIncomes();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchIncomes]);

  return {
    incomes,
    loading,
    error,
    refetch: fetchIncomes,
    addIncome,
    updateIncome,
    deleteIncome,
  };
}
