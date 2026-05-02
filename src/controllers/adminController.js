const AdminService = require("../services/adminService");
const { handleRequest } = require("../utils/controllerHandler");

const AdminController = {
    getDashboard: handleRequest(async (req, res) => {
        const data = await AdminService.getDashboard();
        return res.status(200).json({ success: true, data });
    }, "Admin dashboard"),

    getSystemHealth: handleRequest(async (req, res) => {
        const data = await AdminService.getSystemHealth();
        return res.status(200).json({ success: true, data });
    }, "Admin system health"),

    getHouseholdManagement: handleRequest(async (req, res) => {
        const data = await AdminService.getHouseholdManagement();
        return res.status(200).json({ success: true, data });
    }, "Admin household management"),

    getSummary: handleRequest(async (req, res) => {
        const data = await AdminService.getSummary();
        return res.status(200).json({ success: true, data });
    }, "Admin summary"),

    getUsers: handleRequest(async (req, res) => {
        const { search, page, limit } = req.query;
        const data = await AdminService.getUsers({ search, page, limit });
        return res.status(200).json({ success: true, data });
    }, "Admin get users"),

    getHouseholds: handleRequest(async (req, res) => {
        const data = await AdminService.getHouseholds();
        return res.status(200).json({ success: true, data });
    }, "Admin get households"),

    getHealth: handleRequest(async (req, res) => {
        const data = AdminService.getHealth();
        return res.status(200).json({ success: true, data });
    }, "Admin health"),

    getLogs: handleRequest(async (req, res) => {
        const { level, date } = req.query;
        const data = await AdminService.getLogs({ level, date });
        return res.status(200).json({ success: true, data });
    }, "Admin get logs"),

    getMetrics: handleRequest(async (req, res) => {
        const data = AdminService.getMetrics();
        return res.status(200).json({ success: true, data });
    }, "Admin metrics"),

    deleteUser: handleRequest(async (req, res) => {
        const adminUserId = req.user.userId;
        const targetUserId = parseInt(req.params.id);

        if (isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const data = await AdminService.deleteUser(adminUserId, targetUserId);
        return res.status(200).json({ success: true, data });
    }, "Admin delete user"),

    updateUserRole: handleRequest(async (req, res) => {
        const adminUserId = req.user.userId;
        const targetUserId = parseInt(req.params.id);
        const { role_id } = req.body;

        if (isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const data = await AdminService.updateUserRole(adminUserId, targetUserId, role_id);
        return res.status(200).json({ success: true, data });
    }, "Admin update user role"),

    deleteHousehold: handleRequest(async (req, res) => {
        const householdId = parseInt(req.params.id);

        if (isNaN(householdId)) {
            return res.status(400).json({ success: false, message: "Invalid household ID" });
        }

        const data = await AdminService.deleteHousehold(householdId);
        return res.status(200).json({ success: true, data });
    }, "Admin delete household")
};

module.exports = AdminController;
