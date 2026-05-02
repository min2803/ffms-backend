const UsersService = require("../services/usersService");
const { handleRequest } = require("../utils/controllerHandler");

const UsersController = {
    getAllUsers: handleRequest(async (req, res) => {
        const users = await UsersService.getAllUsers();

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    }, "Get all users"),

    getProfile: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const user = await UsersService.getProfile(userId);

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: user
        });
    }, "Get profile"),

    updateProfile: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const { name, email, full_name, phone_number, date_of_birth } = req.body;
        const updatedUser = await UsersService.updateProfile(userId, { name, email, full_name, phone_number, date_of_birth });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    }, "Update profile"),

    searchUsers: handleRequest(async (req, res) => {
        const { q } = req.query;
        const users = await UsersService.searchUsers(q);
        return res.status(200).json({ success: true, data: users });
    }, "Search users"),

    getUserById: handleRequest(async (req, res) => {
        const { id } = req.params;
        const user = await UsersService.getUserById(id);

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user
        });
    }, "Get user by id"),

    updateUserRole: handleRequest(async (req, res) => {
        const { id } = req.params;
        const { role_id } = req.body;
        const updatedUser = await UsersService.updateUserRole(id, role_id);

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: updatedUser
        });
    }, "Update user role"),

    changePassword: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;
        await UsersService.changePassword(userId, { currentPassword, newPassword });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    }, "Change password"),

    deleteUser: handleRequest(async (req, res) => {
        const { id } = req.params;
        const currentUserId = req.user.userId;
        await UsersService.deleteUser(id, currentUserId);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }, "Delete user")
};

module.exports = UsersController;
