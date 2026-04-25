import { useState, useEffect, useCallback } from "react";
import expenseService from "../services/modules/expenseService";

/**
 * Hook quản lý chi tiêu: lấy danh sách, thêm, cập nhật, xoá.
 *
 * Trả về: { expenses, loading, error, refetch, addExpense, updateExpense, deleteExpense }
 */
export default function useExpenses(params = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lấy danh sách chi tiêu ────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getExpenses(params);
      setExpenses(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ── Thêm mới ──────────────────────────────────────────────────────
  const addExpense = useCallback(async (payload) => {
    try {
      await expenseService.addExpense(payload);
      await fetchExpenses();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchExpenses]);

  // ── Cập nhật ───────────────────────────────────────────────────────
  const updateExpense = useCallback(async (id, payload) => {
    try {
      await expenseService.updateExpense(id, payload);
      await fetchExpenses();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchExpenses]);

  // ── Xoá ────────────────────────────────────────────────────────────
  const deleteExpense = useCallback(async (id) => {
    try {
      await expenseService.deleteExpense(id);
      await fetchExpenses();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
