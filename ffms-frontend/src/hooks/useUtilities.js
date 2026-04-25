import { useState, useEffect, useCallback } from "react";
import utilityService from "../services/modules/utilityService";

/**
 * Hook quản lý tiện ích: mức tiêu thụ, tổng hợp, thêm chỉ số.
 *
 * Trả về: { consumption, summary, loading, error, refetch, addReading }
 */
export default function useUtilities(params = {}) {
  const [consumption, setConsumption] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lấy mức tiêu thụ ──────────────────────────────────────────────
  const fetchConsumption = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await utilityService.getConsumption(params);
      setConsumption(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  // ── Lấy tổng hợp theo tháng ───────────────────────────────────────
  const fetchSummary = useCallback(async (month) => {
    try {
      const data = await utilityService.getSummary(month);
      setSummary(data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchConsumption();
  }, [fetchConsumption]);

  // ── Thêm chỉ số mới ───────────────────────────────────────────────
  const addReading = useCallback(async (payload) => {
    try {
      await utilityService.addReading(payload);
      await fetchConsumption();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, [fetchConsumption]);

  return {
    consumption,
    summary,
    loading,
    error,
    refetch: fetchConsumption,
    fetchSummary,
    addReading,
  };
}
