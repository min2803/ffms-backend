const InvitationModel = require("../models/invitationModel");
const HouseholdModel = require("../models/householdModel");
const UserModel = require("../models/userModel");
const NotificationService = require("./notificationService");

const InvitationService = {
    /**
     * Tạo invitations cho nhiều user cùng lúc
     * Trả về { created: [...], errors: [...] }
     */
    async createInvitations(requesterId, householdId, userIds) {
        // Validate input
        if (!Array.isArray(userIds) || userIds.length === 0) {
            throw { status: 400, message: "userIds must be a non-empty array" };
        }

        // Validate household tồn tại
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Validate requester là owner hoặc admin
        const requesterRole = await HouseholdModel.getMemberRole(householdId, requesterId);
        if (!requesterRole || !["owner", "admin"].includes(requesterRole)) {
            throw { status: 403, message: "Only owner or admin can send invitations" };
        }

        const created = [];
        const errors = [];

        for (const userId of userIds) {
            try {
                // Validate user tồn tại
                const targetUser = await UserModel.findById(userId);
                if (!targetUser) {
                    errors.push({ userId, reason: "User not found" });
                    continue;
                }

                // Không thể mời chính mình
                if (userId === requesterId) {
                    errors.push({ userId, reason: "Cannot invite yourself" });
                    continue;
                }

                // Check user đã là member chưa
                const existingMember = await HouseholdModel.findMember(householdId, userId);
                if (existingMember) {
                    errors.push({ userId, reason: "User is already a member" });
                    continue;
                }

                // Check đã có pending invitation chưa
                const existingInvitation = await InvitationModel.findPendingByHouseholdAndInvitee(householdId, userId);
                if (existingInvitation) {
                    errors.push({ userId, reason: "Invitation already pending" });
                    continue;
                }

                // Tạo invitation
                const invitation = await InvitationModel.create(householdId, requesterId, userId, "member");
                created.push(invitation);

                // Gửi notification cho invitee
                await NotificationService.create(
                    userId,
                    "INVITATION",
                    `Bạn được mời tham gia household "${household.name}"`
                );
            } catch (err) {
                errors.push({ userId, reason: err.message || "Unknown error" });
            }
        }

        return { created, errors };
    },

    /**
     * Lấy pending invitations cho user hiện tại
     */
    async getMyInvitations(userId) {
        return await InvitationModel.findPendingByInvitee(userId);
    },

    /**
     * Accept invitation — dùng transaction để tránh race condition
     */
    async acceptInvitation(userId, invitationId) {
        const invitation = await InvitationModel.findById(invitationId);
        if (!invitation) {
            throw { status: 404, message: "Invitation not found" };
        }

        if (invitation.invitee_id !== userId) {
            throw { status: 403, message: "This invitation is not for you" };
        }

        if (invitation.status !== "pending") {
            throw { status: 400, message: `Invitation already ${invitation.status}` };
        }

        // Transaction: update invitation + add member
        const db = require("../config/db");
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Update invitation status
            await connection.execute(
                "UPDATE invitations SET status = 'accepted' WHERE id = ? AND status = 'pending'",
                [invitationId]
            );

            // Check lần nữa xem user đã là member chưa (race condition)
            const [existingMember] = await connection.execute(
                "SELECT id FROM household_members WHERE household_id = ? AND user_id = ?",
                [invitation.household_id, userId]
            );

            if (existingMember.length === 0) {
                // Thêm vào household_members
                await connection.execute(
                    "INSERT INTO household_members (household_id, user_id, role) VALUES (?, ?, ?)",
                    [invitation.household_id, userId, invitation.role || "member"]
                );
            }

            // Update user's active household_id
            await connection.execute(
                "UPDATE users SET household_id = ? WHERE id = ?",
                [invitation.household_id, userId]
            );

            await connection.commit();

            // Gửi notification cho inviter
            const household = await HouseholdModel.findById(invitation.household_id);
            const acceptedUser = await UserModel.findById(userId);
            await NotificationService.create(
                invitation.inviter_id,
                "MEMBER_JOINED",
                `${acceptedUser?.name || "User"} đã chấp nhận lời mời tham gia "${household?.name || "household"}"`
            );

            return { invitationId, status: "accepted", household_id: invitation.household_id };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Reject invitation
     */
    async rejectInvitation(userId, invitationId) {
        const invitation = await InvitationModel.findById(invitationId);
        if (!invitation) {
            throw { status: 404, message: "Invitation not found" };
        }

        if (invitation.invitee_id !== userId) {
            throw { status: 403, message: "This invitation is not for you" };
        }

        if (invitation.status !== "pending") {
            throw { status: 400, message: `Invitation already ${invitation.status}` };
        }

        await InvitationModel.updateStatus(invitationId, "declined");

        return { invitationId, status: "declined" };
    }
};

module.exports = InvitationService;
