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
        // Tự động kiểm tra và sửa lỗi dữ liệu (Household/Categories/Budget) nếu thiếu
        const HouseholdService = require("./householdService");
        await HouseholdService.ensureUserHasData(userId);

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
    async updateProfile(userId, { name, email }) {
        // Kiểm tra có ít nhất một trường được cung cấp
        if (!name && !email) {
            throw { status: 400, message: "At least one field (name or email) is required" };
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

        const updatedUser = await UserModel.updateById(userId, updateFields);

        // Loại bỏ password trước khi trả về
        const { password_hash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
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
