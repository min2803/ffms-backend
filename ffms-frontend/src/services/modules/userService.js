import axiosClient from "../api/axiosClient";

const ENDPOINT = "/users";

const userService = {
  // ── Người dùng hiện tại ──────────────────────────────────────────────

  /**
   * PUT /users/me
   * Cập nhật hồ sơ của người dùng đang đăng nhập.
   * Token được tự động đính kèm qua interceptor.
   */
  updateProfile(data) {
    return axiosClient.put(`${ENDPOINT}/me`, data);
  },

  // ── Quản trị viên (Admin) ────────────────────────────────────────────

  /**
   * GET /users
   * Lấy danh sách tất cả người dùng.
   * Yêu cầu quyền admin — token admin được tự động đính kèm qua interceptor.
   */
  getAllUsers(params = {}) {
    return axiosClient.get(ENDPOINT, { params });
  },

  /**
   * GET /users/:id
   * Lấy thông tin một người dùng theo ID.
   */
  getUserById(id) {
    return axiosClient.get(`${ENDPOINT}/${id}`);
  },

  /**
   * PUT /users/:id
   * Cập nhật thông tin người dùng theo ID.
   */
  updateUser(id, data) {
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  /**
   * DELETE /users/:id
   * Xoá người dùng theo ID.
   */
  deleteUser(id) {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  },
};

export default userService;
