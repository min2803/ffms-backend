const UserModel = require("../models/userModel");

const UsersService = {
    /**
     * Lấy danh sách tất cả user
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
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    /**
     * Cập nhật thông tin profile của user đang đăng nhập
     */
    async updateProfile(userId, { name, email }) {
        // Kiểm tra có ít nhất một trường được cung cấp
        if (!name && !email) {
            throw { status: 400, message: "At least one field (name or email) is required" };
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
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
};

module.exports = UsersService;
