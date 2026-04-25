import axiosClient from "../api/axiosClient";

const ENDPOINT = "/notifications";

const notificationService = {
  /**
   * GET /notifications
   * Lấy danh sách thông báo.
   */
  getNotifications(params = {}) {
    return axiosClient.get(ENDPOINT, { params });
  },

  /**
   * PUT /notifications/:id/read
   * Đánh dấu thông báo đã đọc.
   */
  markAsRead(id) {
    return axiosClient.put(`${ENDPOINT}/${id}/read`);
  },

  /**
   * POST /notifications
   * Gửi thông báo mới.
   */
  sendNotification(data) {
    return axiosClient.post(ENDPOINT, data);
  },
};

export default notificationService;
