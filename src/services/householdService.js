const HouseholdModel = require("../models/householdModel");
const UserModel = require("../models/userModel");

const HouseholdService = {
    /**
     * Tạo household mới — user tạo sẽ tự động là owner
     */
    async createHousehold(userId, { name, description }) {
        // Kiểm tra trường bắt buộc
        if (!name || name.trim().length === 0) {
            throw { status: 400, message: "Household name is required" };
        }

        // Tạo household
        const household = await HouseholdModel.create({
            name: name.trim(),
            description: description ? description.trim() : null,
            ownerId: userId
        });

        // Thêm user là owner vào bảng household_members
        await HouseholdModel.addMember(household.id, userId, "owner");

        return household;
    },

    /**
     * Lấy thông tin household theo ID — chỉ cho phép thành viên xem
     */
    async getHouseholdById(userId, householdId) {
        // Kiểm tra household tồn tại
        const household = await HouseholdModel.findByIdWithMembers(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra user có phải thành viên không
        const isMember = household.members.some(
            (member) => member.user_id === userId
        );
        if (!isMember) {
            throw { status: 403, message: "You do not have access to this household" };
        }

        return household;
    },

    /**
     * Thêm thành viên vào household — chỉ owner hoặc admin mới được thêm
     */
    async addMember(requesterId, householdId, targetUserId) {
        // Kiểm tra trường bắt buộc
        if (!targetUserId) {
            throw { status: 400, message: "userId is required" };
        }

        // Kiểm tra household tồn tại
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra quyền của người thêm (phải là owner hoặc admin)
        const requesterRole = await HouseholdModel.getMemberRole(householdId, requesterId);
        if (!requesterRole || !["owner", "admin"].includes(requesterRole)) {
            throw { status: 403, message: "Only owner or admin can add members" };
        }

        // Kiểm tra user cần thêm có tồn tại không
        const targetUser = await UserModel.findById(targetUserId);
        if (!targetUser) {
            throw { status: 404, message: "User not found" };
        }

        // Kiểm tra user đã là thành viên chưa
        const existingMember = await HouseholdModel.findMember(householdId, targetUserId);
        if (existingMember) {
            throw { status: 409, message: "User is already a member of this household" };
        }

        // Thêm thành viên
        const membership = await HouseholdModel.addMember(householdId, targetUserId, "member");

        return membership;
    }
};

module.exports = HouseholdService;
