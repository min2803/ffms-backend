const HouseholdService = require("../services/householdService");
const { handleRequest } = require("../utils/controllerHandler");

const HouseholdController = {
    createHousehold: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const { name, description } = req.body;

        const household = await HouseholdService.createHousehold(userId, { name, description });

        return res.status(201).json({
            success: true,
            message: "Household created successfully",
            data: household
        });
    }, "Create household"),

    getHousehold: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = parseInt(req.params.id);

        if (isNaN(householdId)) {
            return res.status(400).json({ success: false, message: "Invalid household ID" });
        }

        const household = await HouseholdService.getHouseholdById(userId, householdId);

        return res.status(200).json({
            success: true,
            message: "Household retrieved successfully",
            data: household
        });
    }, "Get household"),

    getMyHousehold: handleRequest(async (req, res) => {
        const userId = req.user.userId;

        const household = await HouseholdService.ensureUserHasHousehold(userId);
        const fullHousehold = await HouseholdService.getHouseholdById(userId, household.id);

        return res.status(200).json({
            success: true,
            message: "Household retrieved successfully",
            data: fullHousehold
        });
    }, "Get my household"),

    addMember: handleRequest(async (req, res) => {
        const requesterId = req.user.userId;
        const householdId = parseInt(req.params.id);
        const { userId } = req.body;

        if (isNaN(householdId)) {
            return res.status(400).json({ success: false, message: "Invalid household ID" });
        }

        const membership = await HouseholdService.addMember(requesterId, householdId, userId);

        return res.status(201).json({
            success: true,
            message: "Member added successfully",
            data: membership
        });
    }, "Add member"),

    updateHousehold: handleRequest(async (req, res) => {
        const requesterId = req.user.userId;
        const householdId = parseInt(req.params.id);

        if (isNaN(householdId)) {
            return res.status(400).json({ success: false, message: "Invalid household ID" });
        }

        const { name } = req.body;
        const updatedHousehold = await HouseholdService.updateHousehold(requesterId, householdId, { name });

        return res.status(200).json({
            success: true,
            message: "Household updated successfully",
            data: updatedHousehold
        });
    }, "Update household"),

    deleteHousehold: handleRequest(async (req, res) => {
        const requesterId = req.user.userId;
        const householdId = parseInt(req.params.id);

        if (isNaN(householdId)) {
            return res.status(400).json({ success: false, message: "Invalid household ID" });
        }

        await HouseholdService.deleteHousehold(requesterId, householdId);

        return res.status(200).json({
            success: true,
            message: "Household deleted successfully"
        });
    }, "Delete household"),

    removeMember: handleRequest(async (req, res) => {
        const requesterId = req.user.userId;
        const householdId = parseInt(req.params.id);
        const targetUserId = parseInt(req.params.userId);

        if (isNaN(householdId)) {
            return res.status(400).json({ success: false, message: "Invalid household ID" });
        }

        if (isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        await HouseholdService.removeMember(requesterId, householdId, targetUserId);

        return res.status(200).json({
            success: true,
            message: "Member removed successfully"
        });
    }, "Remove member"),

    inviteMember: handleRequest(async (req, res) => {
        const requesterId = req.user.userId;
        const { household_id, user_id } = req.body;

        if (!household_id || isNaN(parseInt(household_id))) {
            return res.status(400).json({ success: false, message: "Valid household_id is required" });
        }

        if (!user_id || isNaN(parseInt(user_id))) {
            return res.status(400).json({ success: false, message: "Valid user_id is required" });
        }

        const membership = await HouseholdService.inviteMember(
            requesterId,
            parseInt(household_id),
            parseInt(user_id)
        );

        return res.status(200).json({
            success: true,
            message: "Member invited successfully",
            data: membership
        });
    }, "Invite member"),

    changeMemberRole: handleRequest(async (req, res) => {
        const requesterId = req.user.userId;
        const membershipId = parseInt(req.params.id);
        const { role } = req.body;

        if (isNaN(membershipId)) {
            return res.status(400).json({ success: false, message: "Invalid membership ID" });
        }

        if (!role || typeof role !== "string") {
            return res.status(400).json({ success: false, message: "role is required and must be a string" });
        }

        const updatedMembership = await HouseholdService.changeMemberRole(
            requesterId,
            membershipId,
            role.trim().toLowerCase()
        );

        return res.status(200).json({
            success: true,
            message: "Member role updated successfully",
            data: updatedMembership
        });
    }, "Change member role"),

    seedData: handleRequest(async (req, res) => {
        const userId = req.user.userId;
        const householdId = req.householdId;

        if (!householdId) {
            return res.status(400).json({
                success: false,
                message: "No household found for this user. Please log out and log in again."
            });
        }

        const result = await HouseholdService.seedSampleData(userId, parseInt(householdId));

        return res.status(200).json({
            success: true,
            message: "Sample data seeded successfully",
            data: result
        });
    }, "Seed data")
};

module.exports = HouseholdController;
