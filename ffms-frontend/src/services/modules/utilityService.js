import axiosClient from "../api/axiosClient";

const ENDPOINT = "/utilities";

const utilityService = {
  /**
   * POST /utilities
   * Thêm chỉ số tiện ích mới (điện, nước, ...).
   */
  addReading(data) {
    return axiosClient.post(ENDPOINT, data);
  },

  /**
   * GET /utilities?type=&month=
   * Lấy mức tiêu thụ theo loại và tháng.
   */
  getConsumption(params = {}) {
    return axiosClient.get(ENDPOINT, { params });
  },

  /**
   * GET /utilities/summary?month=
   * Lấy tổng hợp tiện ích theo tháng.
   */
  getSummary(month) {
    return axiosClient.get(`${ENDPOINT}/summary`, { params: { month } });
  },
};

export default utilityService;
