import { useState, useEffect, useCallback } from "react";
import budgetService from "../services/modules/budgetService";

/**
 * Hook quản lý ngân sách: lấy, thiết lập, cập nhật, xoá.
 *
 * Trả về: { budget, loading, error, refetch, setBudget, updateBudget, deleteBudget }
 */
export default function useBudget(month) {
  const [budget, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lấy ngân sách theo tháng ───────────────────────────────────────
  const fetchBudget = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await budgetService.getBudget(month);
      setBudgetData(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  // ── Thiết lập ngân sách mới ────────────────────────────────────────
  const setBudget = useCallback(async (payload) => {
    try {
      await budgetService.setBudget(payload);
      await fetchBudget();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchBudget]);

  // ── Cập nhật ───────────────────────────────────────────────────────
  const updateBudget = useCallback(async (id, payload) => {
    try {
      await budgetService.updateBudget(id, payload);
      await fetchBudget();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchBudget]);

  // ── Xoá ────────────────────────────────────────────────────────────
  const deleteBudget = useCallback(async (id) => {
    try {
      await budgetService.deleteBudget(id);
      await fetchBudget();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchBudget]);

  return {
    budget,
    loading,
    error,
    refetch: fetchBudget,
    setBudget,
    updateBudget,
    deleteBudget,
  };
}
