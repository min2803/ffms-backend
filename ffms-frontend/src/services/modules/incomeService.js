import axiosClient from "../api/axiosClient";

const ENDPOINT = "/incomes";

const incomeService = {
  /**
   * GET /incomes
   * Lấy danh sách thu nhập.
   */
  getIncomes(params = {}) {
    return axiosClient.get(ENDPOINT, { params });
  },

  /**
   * GET /incomes/:id
   * Lấy chi tiết thu nhập theo ID.
   */
  getIncomeById(id) {
    return axiosClient.get(`${ENDPOINT}/${id}`);
  },

  /**
   * POST /incomes
   * Thêm khoản thu nhập mới.
   */
  addIncome(data) {
    return axiosClient.post(ENDPOINT, data);
  },

  /**
   * PUT /incomes/:id
   * Cập nhật khoản thu nhập.
   */
  updateIncome(id, data) {
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  /**
   * DELETE /incomes/:id
   * Xoá khoản thu nhập.
   */
  deleteIncome(id) {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  },
};

export default incomeService;
