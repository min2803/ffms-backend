const AdminService = require("../services/adminService");

const AdminController = {
    /**
     * GET /api/admin/summary
     */
    async getSummary(req, res) {
        try {
            const data = await AdminService.getSummary();

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Admin summary error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/admin/users
     * Query: { search?, page?, limit? }
     */
    async getUsers(req, res) {
        try {
            const { search, page, limit } = req.query;

            const data = await AdminService.getUsers({ search, page, limit });

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Admin get users error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/admin/households
     */
    async getHouseholds(req, res) {
        try {
            const data = await AdminService.getHouseholds();

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Admin get households error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/admin/system/health
     */
    async getHealth(req, res) {
        try {
            const data = AdminService.getHealth();

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Admin health error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/admin/system/logs
     * Query: { level?, date? }
     */
    async getLogs(req, res) {
        try {
            const { level, date } = req.query;

            const data = await AdminService.getLogs({ level, date });

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Admin get logs error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * GET /api/admin/system/metrics
     */
    async getMetrics(req, res) {
        try {
            const data = AdminService.getMetrics();

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Admin metrics error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * DELETE /api/admin/users/:id
     */
    async deleteUser(req, res) {
        try {
            const adminUserId = req.user.userId;
            const targetUserId = parseInt(req.params.id);

            if (isNaN(targetUserId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID"
                });
            }

            const data = await AdminService.deleteUser(adminUserId, targetUserId);

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Admin delete user error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * PUT /api/admin/users/:id/role
     * Body: { role_id }
     */
    async updateUserRole(req, res) {
        try {
            const adminUserId = req.user.userId;
            const targetUserId = parseInt(req.params.id);
            const { role_id } = req.body;

            if (isNaN(targetUserId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID"
                });
            }

            const data = await AdminService.updateUserRole(adminUserId, targetUserId, role_id);

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Admin update user role error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * DELETE /api/admin/households/:id
     */
    async deleteHousehold(req, res) {
        try {
            const householdId = parseInt(req.params.id);

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid household ID"
                });
            }

            const data = await AdminService.deleteHousehold(householdId);

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Admin delete household error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = AdminController;
