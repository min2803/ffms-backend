import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Interceptor Yêu cầu ─────────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    // Đính kèm token xác thực nếu có trong localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("[Lỗi Yêu cầu]", error);
    return Promise.reject(error);
  }
);

// ── Interceptor Phản hồi ────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp response.data — component nhận dữ liệu sạch
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 401:
          console.warn("[401] Chưa xác thực — chuyển hướng đến trang đăng nhập.");
          // Tuỳ chọn: xoá token và chuyển hướng
          // localStorage.removeItem("accessToken");
          // window.location.href = "/login";
          break;
        case 403:
          console.warn("[403] Bị cấm — không đủ quyền truy cập.");
          break;
        case 404:
          console.warn("[404] Không tìm thấy tài nguyên.");
          break;
        case 500:
          console.error("[500] Lỗi máy chủ nội bộ.");
          break;
        default:
          console.error(`[${status}]`, data?.message || "Lỗi không xác định.");
      }
    } else {
      console.error("[Lỗi Mạng]", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
