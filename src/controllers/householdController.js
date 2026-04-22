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
     * Lấy thông tin hộ gia đình của user hiện tại
     * Tự động bootstrap nếu chưa có
     */
    async getMyHousehold(req, res) {
        try {
            const userId = req.user.userId;
            
            // Gọi bootstrap service để đảm bảo user có data
            const household = await HouseholdService.ensureUserHasData(userId);

            // Fetch đầy đủ thông tin kèm members
            const fullHousehold = await HouseholdService.getHouseholdById(userId, household.id);

            return res.status(200).json({
                success: true,
                message: "Household retrieved successfully",
                data: fullHousehold
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get my household error:", error);
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
    },

    /**
     * Cập nhật tên household — chỉ owner/admin
     */
    async updateHousehold(req, res) {
        try {
            const requesterId = req.user.userId;
            const householdId = parseInt(req.params.id);

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid household ID"
                });
            }

            const { name } = req.body;
            const updatedHousehold = await HouseholdService.updateHousehold(requesterId, householdId, { name });

            return res.status(200).json({
                success: true,
                message: "Household updated successfully",
                data: updatedHousehold
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Update household error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Soft delete household — chỉ owner/admin
     */
    async deleteHousehold(req, res) {
        try {
            const requesterId = req.user.userId;
            const householdId = parseInt(req.params.id);

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid household ID"
                });
            }

            await HouseholdService.deleteHousehold(requesterId, householdId);

            return res.status(200).json({
                success: true,
                message: "Household deleted successfully"
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Delete household error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Xóa thành viên khỏi household — chỉ owner/admin
     */
    async removeMember(req, res) {
        try {
            const requesterId = req.user.userId;
            const householdId = parseInt(req.params.id);
            const targetUserId = parseInt(req.params.userId);

            if (isNaN(householdId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid household ID"
                });
            }

            if (isNaN(targetUserId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID"
                });
            }

            await HouseholdService.removeMember(requesterId, householdId, targetUserId);

            return res.status(200).json({
                success: true,
                message: "Member removed successfully"
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Remove member error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Invite member vào household
     * POST /api/households/invite
     */
    async inviteMember(req, res) {
        try {
            const requesterId = req.user.userId;
            const { household_id, user_id } = req.body;

            if (!household_id || isNaN(parseInt(household_id))) {
                return res.status(400).json({
                    success: false,
                    message: "Valid household_id is required"
                });
            }

            if (!user_id || isNaN(parseInt(user_id))) {
                return res.status(400).json({
                    success: false,
                    message: "Valid user_id is required"
                });
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
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Invite member error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Thay đổi role thành viên trong household
     * PATCH /api/households/members/:id/role
     */
    async changeMemberRole(req, res) {
        try {
            const requesterId = req.user.userId;
            const membershipId = parseInt(req.params.id);
            const { role } = req.body;

            if (isNaN(membershipId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid membership ID"
                });
            }

            if (!role || typeof role !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "role is required and must be a string"
                });
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
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Change member role error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = HouseholdController;
