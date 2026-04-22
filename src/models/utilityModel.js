const db = require("../config/db");

const UtilityModel = {
    /**
     * Tạo utility reading mới
     */
    async create({ userId, type, value, cost, date }) {
        const [result] = await db.execute(
            "INSERT INTO utility_readings (user_id, type, value, cost, date) VALUES (?, ?, ?, ?, ?)",
            [userId, type, value, cost, date]
        );

        return {
            id: result.insertId,
            user_id: userId,
            type,
            value,
            cost,
            date,
            created_at: new Date()
        };
    },

    /**
     * Lấy danh sách readings với optional filters (type, month)
     * month format: 'YYYY-MM'
     */
    async findAll({ type, month }) {
        let sql = "SELECT * FROM utility_readings WHERE 1=1";
        const params = [];

        if (type) {
            sql += " AND type = ?";
            params.push(type);
        }

        if (month) {
            sql += " AND DATE_FORMAT(date, '%Y-%m') = ?";
            params.push(month);
        }

        sql += " ORDER BY date DESC";

        try {
            const [rows] = await db.execute(sql, params);
            return rows || [];
        } catch (error) {
            console.error("UtilityModel.findAll error:", error);
            return []; // Trả về mảng rỗng thay vì crash nếu có lỗi DB
        }
    },

    /**
     * Lấy summary: tổng usage và tổng cost theo tháng, group by type
     * month format: 'YYYY-MM'
     */
    async getSummary(month) {
        const [rows] = await db.execute(
            `SELECT 
                type,
                SUM(value) AS totalUsage,
                SUM(cost) AS totalCost
             FROM utility_readings
             WHERE DATE_FORMAT(date, '%Y-%m') = ?
             GROUP BY type`,
            [month]
        );
        return rows;
    }
};

module.exports = UtilityModel;
