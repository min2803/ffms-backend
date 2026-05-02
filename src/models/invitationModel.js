const db = require("../config/db");

const InvitationModel = {
    /**
     * Tạo một invitation mới
     */
    async create(householdId, inviterId, inviteeId, role = "member") {
        const [result] = await db.execute(
            `INSERT INTO invitations (household_id, inviter_id, invitee_id, role, status)
             VALUES (?, ?, ?, ?, 'pending')`,
            [householdId, inviterId, inviteeId, role]
        );
        return {
            id: result.insertId,
            household_id: householdId,
            inviter_id: inviterId,
            invitee_id: inviteeId,
            role,
            status: "pending",
            created_at: new Date()
        };
    },

    /**
     * Tìm invitation theo ID
     */
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM invitations WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Tìm invitation pending giữa household và invitee (tránh trùng)
     */
    async findPendingByHouseholdAndInvitee(householdId, inviteeId) {
        const [rows] = await db.execute(
            `SELECT * FROM invitations
             WHERE household_id = ? AND invitee_id = ? AND status = 'pending'`,
            [householdId, inviteeId]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Lấy danh sách invitation pending cho user (kèm household name, inviter name)
     */
    async findPendingByInvitee(userId) {
        const [rows] = await db.execute(
            `SELECT i.*, h.name AS household_name, u.name AS inviter_name, u.email AS inviter_email
             FROM invitations i
             JOIN households h ON i.household_id = h.id
             JOIN users u ON i.inviter_id = u.id
             WHERE i.invitee_id = ? AND i.status = 'pending'
             ORDER BY i.created_at DESC`,
            [userId]
        );
        return rows;
    },

    /**
     * Lấy tất cả invitation của household (cho hiển thị trạng thái)
     */
    async findByHousehold(householdId) {
        const [rows] = await db.execute(
            `SELECT i.*, u.name AS invitee_name, u.email AS invitee_email, u.display_id AS invitee_display_id
             FROM invitations i
             JOIN users u ON i.invitee_id = u.id
             WHERE i.household_id = ?
             ORDER BY i.created_at DESC`,
            [householdId]
        );
        return rows;
    },

    /**
     * Update status (accepted / declined)
     */
    async updateStatus(id, status) {
        await db.execute(
            "UPDATE invitations SET status = ? WHERE id = ?",
            [status, id]
        );
        return this.findById(id);
    }
};

module.exports = InvitationModel;
