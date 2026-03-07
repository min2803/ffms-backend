const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const SALT_ROUNDS = 10;

const AuthService = {
    /**
     * Đăng ký tài khoản mới
     */
    async register({ name, email, password }) {
        // Kiểm tra các trường bắt buộc
        if (!name || !email || !password) {
            throw { status: 400, message: "Name, email, and password are required" };
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw { status: 409, message: "Email already exists" };
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Tạo user
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        return user;
    },

    /**
     * Đăng nhập
     */
    async login({ email, password }) {
        // Kiểm tra các trường bắt buộc
        if (!email || !password) {
            throw { status: 400, message: "Email and password are required" };
        }

        // Tìm user theo email
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw { status: 401, message: "Invalid email or password" };
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { status: 401, message: "Invalid email or password" };
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Trả về user (không kèm password) và token
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };
    }
};

module.exports = AuthService;
