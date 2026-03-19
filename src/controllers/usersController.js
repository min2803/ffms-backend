const UsersService = require("../services/usersService");

const UsersController = {
    /**
     * Lấy danh sách tất cả user
     */
    async getAllUsers(req, res) {
        try {
            const users = await UsersService.getAllUsers();

            return res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
                data: users
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get all users error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy thông tin profile của user đang đăng nhập
     */
    async getProfile(req, res) {
        try {
            const userId = req.user.userId;
            const user = await UsersService.getProfile(userId);

            return res.status(200).json({
                success: true,
                message: "Profile retrieved successfully",
                data: user
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get profile error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Cập nhật thông tin profile của user đang đăng nhập
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { name, email } = req.body;
            const updatedUser = await UsersService.updateProfile(userId, { name, email });

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedUser
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Update profile error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = UsersController;
