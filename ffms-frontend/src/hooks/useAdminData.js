import { useState, useEffect, useCallback } from "react";
import axiosClient from "../services/api/axiosClient";

/**
 * Hook quản lý dữ liệu cho phần Admin.
 * Bao gồm dashboard admin, system health, household management admin.
 */
export default function useAdminData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi lên các API giả định của hệ thống admin
      const res = await axiosClient.get(`/admin/${endpoint}`);
      setData(res?.data || res);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
