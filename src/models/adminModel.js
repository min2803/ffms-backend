const db = require("../config/db");

const AdminModel = {
    /**
     * Đếm tổng số users
     */
    async countUsers() {
        const [rows] = await db.execute("SELECT COUNT(*) AS total FROM users");
        return parseInt(rows[0].total);
    },

    /**
     * Đếm tổng số households (chưa bị xóa)
     */
    async countHouseholds() {
        const [rows] = await db.execute(
            "SELECT COUNT(*) AS total FROM households WHERE is_deleted = false OR is_deleted IS NULL"
        );
        return parseInt(rows[0].total);
    },

    /**
     * Đếm tổng số transactions (incomes + expenses)
     */
    async countTransactions() {
        const [rows] = await db.execute(
            `SELECT
                (SELECT COUNT(*) FROM incomes) +
                (SELECT COUNT(*) FROM expenses) AS total`
        );
        return parseInt(rows[0].total);
    },

    /**
     * Tìm kiếm users với pagination
     */
    async searchUsers(search, limit, offset) {
        let query = "SELECT id, name, email, role, created_at, updated_at FROM users";
        const params = [];

        if (search) {
            query += " WHERE name LIKE ? OR email LIKE ?";
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const [rows] = await db.execute(query, params);
        return rows;
    },

    /**
     * Đếm tổng users theo search (cho pagination)
     */
    async countSearchUsers(search) {
        let query = "SELECT COUNT(*) AS total FROM users";
        const params = [];

        if (search) {
            query += " WHERE name LIKE ? OR email LIKE ?";
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        const [rows] = await db.execute(query, params);
        return parseInt(rows[0].total);
    },

    /**
     * Lấy tất cả households kèm thông tin owner + số thành viên
     */
    async getAllHouseholds() {
        const [rows] = await db.execute(
            `SELECT h.*, u.name AS owner_name, u.email AS owner_email,
                    (SELECT COUNT(*) FROM household_members hm WHERE hm.household_id = h.id) AS member_count
             FROM households h
             JOIN users u ON h.owner_id = u.id
             WHERE h.is_deleted = false OR h.is_deleted IS NULL
             ORDER BY h.created_at DESC`
        );
        return rows;
    },

    /**
     * Tìm user theo ID (không kèm password)
     */
    async findUserById(id) {
        const [rows] = await db.execute(
            "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Xóa user (hard delete — cascade sẽ xóa dữ liệu liên quan)
     */
    async deleteUser(id) {
        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
        return result.affectedRows > 0;
    },

    /**
     * Cập nhật role của user
     */
    async updateUserRole(id, role) {
        const [result] = await db.execute(
            "UPDATE users SET role = ? WHERE id = ?",
            [role, id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Xóa household kèm dữ liệu liên quan (cascade)
     */
    async deleteHousehold(id) {
        // Xóa theo thứ tự: expenses → incomes → budgets → members → household
        await db.execute("DELETE FROM expenses WHERE household_id = ?", [id]);
        await db.execute("DELETE FROM incomes WHERE household_id = ?", [id]);
        await db.execute("DELETE FROM budgets WHERE household_id = ?", [id]);
        await db.execute("DELETE FROM household_members WHERE household_id = ?", [id]);
        const [result] = await db.execute("DELETE FROM households WHERE id = ?", [id]);
        return result.affectedRows > 0;
    },

    /**
     * Tìm household theo ID (bao gồm cả đã xóa — cho admin)
     */
    async findHouseholdById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM households WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Lấy system logs với filter
     */
    async getLogs({ level, date, limit = 50, offset = 0 }) {
        let query = "SELECT * FROM system_logs WHERE 1=1";
        const params = [];

        if (level) {
            query += " AND level = ?";
            params.push(level);
        }

        if (date) {
            query += " AND DATE(created_at) = ?";
            params.push(date);
        }

        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const [rows] = await db.execute(query, params);
        return rows;
    }
};

module.exports = AdminModel;
