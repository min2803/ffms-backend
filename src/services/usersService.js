const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");

const UsersService = {
    /**
     * Lấy danh sách tất cả user (Admin only)
     */
    async getAllUsers() {
        const users = await UserModel.findAll();
        return users;
    },

    /**
     * Lấy thông tin profile của user đang đăng nhập
     */
    async getProfile(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        // Loại bỏ password trước khi trả về
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    /**
     * Cập nhật thông tin profile của user đang đăng nhập (name, email)
     */
    async updateProfile(userId, { name, email, full_name, phone_number, date_of_birth }) {
        // Kiểm tra có ít nhất một trường được cung cấp
        if (!name && !email && !full_name && phone_number === undefined && date_of_birth === undefined) {
            throw { status: 400, message: "At least one field is required" };
        }

        // Validate email format nếu có
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw { status: 400, message: "Invalid email format" };
            }
        }

        // Validate name length nếu có
        if (name && name.trim().length === 0) {
            throw { status: 400, message: "Name cannot be empty" };
        }

        // Kiểm tra user tồn tại
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            throw { status: 404, message: "User not found" };
        }

        // Nếu email thay đổi, kiểm tra trùng lặp
        if (email && email !== existingUser.email) {
            const emailTaken = await UserModel.findByEmail(email);
            if (emailTaken) {
                throw { status: 409, message: "Email already exists" };
            }
        }

        // Tạo object chứa các trường cần cập nhật
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (full_name !== undefined) updateFields.full_name = full_name || null;
        if (phone_number !== undefined) updateFields.phone_number = phone_number || null;
        if (date_of_birth !== undefined) updateFields.date_of_birth = date_of_birth || null;

        const updatedUser = await UserModel.updateById(userId, updateFields);

        // Loại bỏ password trước khi trả về
        const { password_hash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    },

    /**
     * Đổi mật khẩu của user đang đăng nhập
     */
    async changePassword(userId, { currentPassword, newPassword }) {
        if (!currentPassword || !newPassword) {
            throw { status: 400, message: "currentPassword and newPassword are required" };
        }
        if (newPassword.length < 6) {
            throw { status: 400, message: "New password must be at least 6 characters" };
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            throw { status: 401, message: "Current password is incorrect" };
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await UserModel.updateById(userId, { password_hash: hashed });
    },

    /**
     * Tìm user theo keyword (name/email) — cho invite member flow
     */
    async searchUsers(keyword) {
        if (!keyword || keyword.trim().length === 0) {
            throw { status: 400, message: "Search keyword is required" };
        }
        const trimmed = keyword.trim();
        const isNumeric = /^\d+$/.test(trimmed);
        // Allow single-digit UID search; require 2+ chars for name/email
        if (!isNumeric && trimmed.length < 2) {
            throw { status: 400, message: "Search keyword must be at least 2 characters" };
        }
        return await UserModel.searchByKeyword(trimmed);
    },

    /**
     * Lấy thông tin user theo ID
     */
    async getUserById(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        // Loại bỏ password trước khi trả về
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    /**
     * Cập nhật role của user (Admin only)
     * @param {number} id - User ID
     * @param {number} role_id - Role ID (1 = admin, 2 = user)
     */
    async updateUserRole(id, role_id) {
        // Validate role_id
        const allowedRoleIds = [1, 2]; // 1 = admin, 2 = user
        if (!role_id) {
            throw { status: 400, message: "role_id is required" };
        }
        const parsedRoleId = parseInt(role_id);
        if (!allowedRoleIds.includes(parsedRoleId)) {
            throw { status: 400, message: "Invalid role_id. Allowed values: 1 (admin), 2 (user)" };
        }

        // Kiểm tra user tồn tại
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            throw { status: 404, message: "User not found" };
        }

        const updatedUser = await UserModel.updateById(id, { role_id: parsedRoleId });

        // Loại bỏ password trước khi trả về
        const { password_hash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    },

    /**
     * Xóa user (Admin only)
     */
    async deleteUser(id, currentUserId) {
        // Không cho phép admin tự xóa chính mình
        if (parseInt(id) === parseInt(currentUserId)) {
            throw { status: 400, message: "Cannot delete your own account" };
        }

        // Kiểm tra user tồn tại
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            throw { status: 404, message: "User not found" };
        }

        await UserModel.deleteById(id);
    }
};

module.exports = UsersService;
