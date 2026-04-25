import axiosClient from "../api/axiosClient";

const ENDPOINT = "/households";

const householdService = {
  // ── Hộ gia đình ─────────────────────────────────────────────────────

  /**
   * POST /households
   * Tạo hộ gia đình mới.
   */
  createHousehold(data) {
    return axiosClient.post(ENDPOINT, data);
  },

  /**
   * GET /households/me
   * Lấy thông tin hộ gia đình của người dùng hiện tại (Tự động bootstrap).
   */
  getMyHousehold() {
    return axiosClient.get(`${ENDPOINT}/me`);
  },

  /**
   * PUT /households/:id
   * Cập nhật thông tin hộ gia đình.
   */
  updateHousehold(id, data) {
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  /**
   * DELETE /households/:id
   * Xoá hộ gia đình.
   */
  deleteHousehold(id) {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  },

  // ── Thành viên ──────────────────────────────────────────────────────

  /**
   * POST /households/:id/members
   * Thêm thành viên vào hộ gia đình.
   */
  addMember(id, userId) {
    return axiosClient.post(`${ENDPOINT}/${id}/members`, { userId });
  },

  /**
   * DELETE /households/:id/members/:userId
   * Xoá thành viên khỏi hộ gia đình.
   */
  removeMember(id, userId) {
    return axiosClient.delete(`${ENDPOINT}/${id}/members/${userId}`);
  },

  /**
   * POST /household/invite
   * Mời thành viên tham gia hộ gia đình.
   */
  inviteMember(data) {
    return axiosClient.post("/household/invite", data);
  },

  /**
   * PATCH /household/members/:id/role
   * Thay đổi vai trò của thành viên trong hộ gia đình.
   */
  changeRole(id, data) {
    return axiosClient.patch(`/household/members/${id}/role`, data);
  },
};

export default householdService;
