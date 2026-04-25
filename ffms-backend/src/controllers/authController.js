const AuthService = require("../services/authService");

const AuthController = {
    /**
     * Đăng ký tài khoản
     */
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await AuthService.register({ name, email, password });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Register error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Đăng nhập — trả về accessToken và refreshToken
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login({ email, password });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: result
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Login error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Đăng xuất — vô hiệu hóa access token và refresh token
     */
    async logout(req, res) {
        try {
            // Lấy access token từ header Authorization
            const authHeader = req.headers.authorization;
            const accessToken = authHeader.split(" ")[1];

            // Lấy refresh token từ body (tùy chọn)
            const { refreshToken } = req.body;

            // Thêm access token vào blacklist và xóa refresh token
            await AuthService.logout(accessToken, refreshToken);

            return res.status(200).json({
                success: true,
                message: "Logout successful"
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Logout error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Refresh — tạo access token mới từ refresh token
     */
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            const tokens = await AuthService.refresh(refreshToken);

            return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: tokens
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Refresh token error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = AuthController;
