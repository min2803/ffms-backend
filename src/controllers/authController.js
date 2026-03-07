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
     * Đăng nhập
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
    }
};

module.exports = AuthController;
