const UsersService = require("../services/usersService");

const UsersController = {
    /**
     * Lấy danh sách tất cả user (Admin only)
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
     * Cập nhật thông tin profile của user đang đăng nhập (name, email)
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
    },

    /**
     * Lấy thông tin user theo ID
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UsersService.getUserById(id);

            return res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: user
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get user by id error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Cập nhật role của user (Admin only)
     */
    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const updatedUser = await UsersService.updateUserRole(id, role);

            return res.status(200).json({
                success: true,
                message: "User role updated successfully",
                data: updatedUser
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Update user role error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Xóa user (Admin only)
     */
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const currentUserId = req.user.userId;
            await UsersService.deleteUser(id, currentUserId);

            return res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Delete user error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = UsersController;
