const db = require("../config/db");

const HouseholdModel = {
    /**
     * Tạo household mới
     */
    async create({ name, description, ownerId }) {
        const [result] = await db.execute(
            "INSERT INTO households (name, description, owner_id) VALUES (?, ?, ?)",
            [name, description || null, ownerId]
        );

        return {
            id: result.insertId,
            name,
            description: description || null,
            owner_id: ownerId,
            created_at: new Date()
        };
    },

    /**
     * Tìm household theo ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM households WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Tìm household theo ID kèm danh sách thành viên
     */
    async findByIdWithMembers(id) {
        const [household] = await db.execute(
            "SELECT * FROM households WHERE id = ?",
            [id]
        );

        if (household.length === 0) return null;

        const [members] = await db.execute(
            `SELECT hm.id AS membership_id, hm.role, hm.joined_at,
                    u.id AS user_id, u.name, u.email
             FROM household_members hm
             JOIN users u ON hm.user_id = u.id
             WHERE hm.household_id = ?`,
            [id]
        );

        return {
            ...household[0],
            members
        };
    },

    /**
     * Thêm thành viên vào household
     */
    async addMember(householdId, userId, role = "member") {
        const [result] = await db.execute(
            "INSERT INTO household_members (household_id, user_id, role) VALUES (?, ?, ?)",
            [householdId, userId, role]
        );

        return {
            id: result.insertId,
            household_id: householdId,
            user_id: userId,
            role,
            joined_at: new Date()
        };
    },

    /**
     * Tìm thành viên trong household
     */
    async findMember(householdId, userId) {
        const [rows] = await db.execute(
            "SELECT * FROM household_members WHERE household_id = ? AND user_id = ?",
            [householdId, userId]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Lấy role của user trong household
     */
    async getMemberRole(householdId, userId) {
        const member = await this.findMember(householdId, userId);
        return member ? member.role : null;
    }
};

module.exports = HouseholdModel;
