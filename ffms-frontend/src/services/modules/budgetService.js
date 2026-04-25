import axiosClient from "../api/axiosClient";

const ENDPOINT = "/budgets";

const budgetService = {
  /**
   * POST /budgets
   * Thiết lập ngân sách mới.
   */
  setBudget(data) {
    return axiosClient.post(ENDPOINT, data);
  },

  /**
   * GET /budgets?month=
   * Lấy ngân sách theo tháng.
   */
  getBudget(month) {
    return axiosClient.get(ENDPOINT, { params: { month } });
  },

  /**
   * PUT /budgets/:id
   * Cập nhật ngân sách theo ID.
   */
  updateBudget(id, data) {
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  /**
   * DELETE /budgets/:id
   * Xoá ngân sách theo ID.
   */
  deleteBudget(id) {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  },
};

export default budgetService;
