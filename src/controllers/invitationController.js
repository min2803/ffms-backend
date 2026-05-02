const InvitationService = require("../services/invitationService");
const { handleRequest } = require("../utils/controllerHandler");

const InvitationController = {
    /**
     * POST /households/:id/invitations
     * Tạo invitations cho nhiều user
     */
    createInvitations: handleRequest(async (req, res) => {
        const requesterId = req.user.userId;
        const householdId = parseInt(req.params.id);
        const { userIds } = req.body;

        if (isNaN(householdId)) {
            return res.status(400).json({ success: false, message: "Invalid household ID" });
        }

        const result = await InvitationService.createInvitations(requesterId, householdId, userIds);

        return res.status(201).json({
            success: true,
            message: `${result.created.length} invitation(s) sent`,
            data: result
        });
    }, "Create invitations"),

    /**
     * GET /invitations/me
     * Lấy pending invitations cho user hiện tại
     */
    getMyInvitations: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const data = await InvitationService.getMyInvitations(userId);

        return res.status(200).json({
            success: true,
            data
        });
    }, "Get my invitations"),

    /**
     * POST /invitations/:id/accept
     */
    acceptInvitation: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const invitationId = parseInt(req.params.id);

        if (isNaN(invitationId)) {
            return res.status(400).json({ success: false, message: "Invalid invitation ID" });
        }

        const data = await InvitationService.acceptInvitation(userId, invitationId);

        return res.status(200).json({
            success: true,
            message: "Invitation accepted",
            data
        });
    }, "Accept invitation"),

    /**
     * POST /invitations/:id/reject
     */
    rejectInvitation: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const invitationId = parseInt(req.params.id);

        if (isNaN(invitationId)) {
            return res.status(400).json({ success: false, message: "Invalid invitation ID" });
        }

        const data = await InvitationService.rejectInvitation(userId, invitationId);

        return res.status(200).json({
            success: true,
            message: "Invitation declined",
            data
        });
    }, "Reject invitation")
};

module.exports = InvitationController;
