import axiosClient from "../api/axiosClient";

const dashboardService = {
  // ── Tổng quan ───────────────────────────────────────────────────────

  /**
   * GET /dashboard/summary
   * Lấy dữ liệu tổng quan dashboard.
   */
  getSummary(params = {}) {
    return axiosClient.get("/dashboard/summary", { params });
  },

  /**
   * GET /dashboard/compare
   * So sánh dữ liệu tài chính (theo kỳ, theo tháng, ...).
   */
  compare(params = {}) {
    return axiosClient.get("/dashboard/compare", { params });
  },

  // ── Báo cáo ─────────────────────────────────────────────────────────

  /**
   * GET /reports/expense-category
   * Lấy chi tiêu theo danh mục.
   */
  expenseByCategory(params = {}) {
    return axiosClient.get("/reports/expense-category", { params });
  },

  /**
   * GET /reports/financial
   * Lấy báo cáo tài chính tổng hợp.
   */
  financialReport(params = {}) {
    return axiosClient.get("/reports/financial", { params });
  },

  /**
   * GET /reports/trend
   * Lấy dữ liệu xu hướng chi tiêu / thu nhập.
   */
  trend(params = {}) {
    return axiosClient.get("/reports/trend", { params });
  },

  /**
   * GET /reports/detail
   * Lấy báo cáo chi tiết.
   */
  detail(params = {}) {
    return axiosClient.get("/reports/detail", { params });
  },
};

export default dashboardService;
