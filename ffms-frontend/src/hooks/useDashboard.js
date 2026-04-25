import { useState, useEffect, useCallback } from "react";
import dashboardService from "../services/modules/dashboardService";

/**
 * Hook lấy dữ liệu dashboard: tổng quan, so sánh, báo cáo.
 *
 * Trả về: { summary, loading, error, refetch, compare, expenseByCategory, financialReport, trend, detail }
 */
export default function useDashboard(params = {}) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Lấy tổng quan ──────────────────────────────────────────────────
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSummary(params);
      setSummary(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // ── So sánh ────────────────────────────────────────────────────────
  const compare = useCallback(async (compareParams = {}) => {
    try {
      return await dashboardService.compare(compareParams);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  // ── Chi tiêu theo danh mục ─────────────────────────────────────────
  const expenseByCategory = useCallback(async (catParams = {}) => {
    try {
      return await dashboardService.expenseByCategory(catParams);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  // ── Báo cáo tài chính ──────────────────────────────────────────────
  const financialReport = useCallback(async (reportParams = {}) => {
    try {
      return await dashboardService.financialReport(reportParams);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  // ── Xu hướng ───────────────────────────────────────────────────────
  const trend = useCallback(async (trendParams = {}) => {
    try {
      return await dashboardService.trend(trendParams);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  // ── Chi tiết ───────────────────────────────────────────────────────
  const detail = useCallback(async (detailParams = {}) => {
    try {
      return await dashboardService.detail(detailParams);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
    compare,
    expenseByCategory,
    financialReport,
    trend,
    detail,
  };
}
