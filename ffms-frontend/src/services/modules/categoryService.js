import axiosClient from "../api/axiosClient";

const ENDPOINT = "/categories";

const categoryService = {
  /**
   * GET /categories
   * Lấy danh sách categories theo household
   */
  getCategories(params = {}) {
    return axiosClient.get(ENDPOINT, { params });
  },
};

export default categoryService;
