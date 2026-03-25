const HouseholdService = require("../services/householdService");

const HouseholdController = {
    /**
     * Tạo household mới
     */
    async createHousehold(req, res) {
        try {
            const userId = req.user.userId;
            const { name, description } = req.body;

            const household = await HouseholdService.createHousehold(userId, { name, description });

            return res.status(201).json({
                success: true,
                message: "Household created successfully",
                data: household
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Create household error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy thông tin household theo ID
     */
    async getHousehold(req, res) {
        try {
            const userId = req.user.userId;
            const householdId = parseInt(req.params.id);

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid household ID"
                });
            }

            const household = await HouseholdService.getHouseholdById(userId, householdId);

            return res.status(200).json({
                success: true,
                message: "Household retrieved successfully",
                data: household
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get household error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Thêm thành viên vào household
     */
    async addMember(req, res) {
        try {
            const requesterId = req.user.userId;
            const householdId = parseInt(req.params.id);
            const { userId } = req.body;

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid household ID"
                });
            }

            const membership = await HouseholdService.addMember(requesterId, householdId, userId);

            return res.status(201).json({
                success: true,
                message: "Member added successfully",
                data: membership
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Add member error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = HouseholdController;
