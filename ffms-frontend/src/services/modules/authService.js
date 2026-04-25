import axiosClient from "../api/axiosClient";

const ENDPOINT = "/auth";

const authService = {
  /**
   * POST /auth/register
   * Đăng ký tài khoản người dùng mới.
   */
  register(data) {
    return axiosClient.post(`${ENDPOINT}/register`, data);
  },

  /**
   * POST /auth/login
   * Đăng nhập → lưu accessToken vào localStorage.
   */
  async login(data) {
    const response = await axiosClient.post(`${ENDPOINT}/login`, data);

    // Backend trả về: { success, message, data: { user, accessToken, refreshToken } }
    // Axios interceptor trả response.data (outer) → tokens nằm trong response.data
    const result = response?.data || response;
    const token = result?.accessToken || result?.token;
    if (token) {
      localStorage.setItem("accessToken", token);
    }

    // Lưu refresh token nếu có
    const refresh = result?.refreshToken;
    if (refresh) {
      localStorage.setItem("refreshToken", refresh);
    }

    return response;
  },

  /**
   * GET /auth/me
   * Lấy thông tin người dùng hiện tại đang đăng nhập.
   * Token được tự động đính kèm qua interceptor của axiosClient.
   */
  getMe() {
    return axiosClient.get(`${ENDPOINT}/me`);
  },

  /**
   * POST /auth/logout
   * Đăng xuất → xoá token khỏi localStorage.
   */
  async logout() {
    try {
      await axiosClient.post(`${ENDPOINT}/logout`);
    } finally {
      // Luôn xoá token dù request thất bại
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  /**
   * POST /auth/refresh
   * Đổi refresh token lấy access token mới.
   */
  async refreshToken(refreshToken) {
    const response = await axiosClient.post(`${ENDPOINT}/refresh`, {
      refreshToken,
    });

    const result = response?.data || response;

    // Lưu access token mới
    const newToken = result?.accessToken || result?.token;
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    }

    // Lưu refresh token mới nếu server xoay vòng token
    const newRefresh = result?.refreshToken;
    if (newRefresh) {
      localStorage.setItem("refreshToken", newRefresh);
    }

    return response;
  },
};

export default authService;
