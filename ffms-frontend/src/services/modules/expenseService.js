import axiosClient from "../api/axiosClient";

const ENDPOINT = "/expenses";

const expenseService = {
  /**
   * POST /expenses
   * Thêm khoản chi tiêu mới.
   */
  addExpense(data) {
    return axiosClient.post(ENDPOINT, data);
  },

  /**
   * GET /expenses
   * Lấy danh sách tất cả khoản chi tiêu.
   */
  getExpenses(params = {}) {
    return axiosClient.get(ENDPOINT, { params });
  },

  /**
   * GET /expenses/:id
   * Lấy chi tiết một khoản chi tiêu theo ID.
   */
  getExpenseDetail(id) {
    return axiosClient.get(`${ENDPOINT}/${id}`);
  },

  /**
   * PUT /expenses/:id
   * Cập nhật khoản chi tiêu theo ID.
   */
  updateExpense(id, data) {
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  /**
   * DELETE /expenses/:id
   * Xoá khoản chi tiêu theo ID.
   */
  deleteExpense(id) {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  },
};

export default expenseService;
