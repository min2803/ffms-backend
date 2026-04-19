const HouseholdModel = require("../models/householdModel");
const UserModel = require("../models/userModel");
const NotificationService = require("./notificationService");

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
        // Kiểm tra household tồn tại (đã lọc is_deleted = false)
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

        // Auto notification
        await NotificationService.create(
            targetUserId,
            "MEMBER_JOINED",
            `Bạn đã được thêm vào household "${household.name}"`
        );

        return membership;
    },

    /**
     * Cập nhật tên household — chỉ owner hoặc admin
     */
    async updateHousehold(requesterId, householdId, { name }) {
        // Validate name
        if (!name || name.trim().length === 0) {
            throw { status: 400, message: "Household name is required" };
        }

        // Kiểm tra household tồn tại (đã lọc is_deleted = false)
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra quyền: chỉ owner hoặc admin trong household
        const requesterRole = await HouseholdModel.getMemberRole(householdId, requesterId);
        if (!requesterRole || !["owner", "admin"].includes(requesterRole)) {
            throw { status: 403, message: "Only owner or admin can update household" };
        }

        // Cập nhật
        const updatedHousehold = await HouseholdModel.updateById(householdId, {
            name: name.trim()
        });

        return updatedHousehold;
    },

    /**
     * Soft delete household — chỉ owner hoặc admin
     * Đánh dấu is_deleted = true, không xóa dữ liệu thật
     */
    async deleteHousehold(requesterId, householdId) {
        // Kiểm tra household tồn tại (đã lọc is_deleted = false)
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra quyền: chỉ owner hoặc admin trong household
        const requesterRole = await HouseholdModel.getMemberRole(householdId, requesterId);
        if (!requesterRole || !["owner", "admin"].includes(requesterRole)) {
            throw { status: 403, message: "Only owner or admin can delete household" };
        }

        // Soft delete
        await HouseholdModel.softDelete(householdId);
    },

    /**
     * Xóa thành viên khỏi household — chỉ owner hoặc admin
     * Không cho phép xóa owner
     */
    async removeMember(requesterId, householdId, targetUserId) {
        // Kiểm tra household tồn tại (đã lọc is_deleted = false)
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra quyền: chỉ owner hoặc admin trong household
        const requesterRole = await HouseholdModel.getMemberRole(householdId, requesterId);
        if (!requesterRole || !["owner", "admin"].includes(requesterRole)) {
            throw { status: 403, message: "Only owner or admin can remove members" };
        }

        // Kiểm tra target user có phải thành viên không
        const targetMember = await HouseholdModel.findMember(householdId, targetUserId);
        if (!targetMember) {
            throw { status: 404, message: "Member not found in this household" };
        }

        // Không cho phép xóa owner
        if (targetMember.role === "owner") {
            throw { status: 400, message: "Cannot remove the owner from household" };
        }

        // Xóa thành viên
        await HouseholdModel.removeMember(householdId, targetUserId);
    },

    /**
     * Invite member vào household — chỉ owner hoặc admin
     */
    async inviteMember(requesterId, householdId, targetUserId) {
        // Validate input
        if (!householdId) {
            throw { status: 400, message: "household_id is required" };
        }
        if (!targetUserId) {
            throw { status: 400, message: "user_id is required" };
        }

        // Kiểm tra household tồn tại
        const household = await HouseholdModel.findById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        // Kiểm tra quyền của requester (phải là owner hoặc admin)
        const requesterRole = await HouseholdModel.getMemberRole(householdId, requesterId);
        if (!requesterRole || !["owner", "admin"].includes(requesterRole)) {
            throw { status: 403, message: "Only owner or admin can invite members" };
        }

        // Kiểm tra target user tồn tại
        const targetUser = await UserModel.findById(targetUserId);
        if (!targetUser) {
            throw { status: 404, message: "User not found" };
        }

        // Kiểm tra user đã là thành viên chưa
        const existingMember = await HouseholdModel.findMember(householdId, targetUserId);
        if (existingMember) {
            throw { status: 409, message: "User is already a member of this household" };
        }

        // Thêm thành viên với role mặc định là "member"
        const membership = await HouseholdModel.addMember(householdId, targetUserId, "member");

        // Auto notification
        await NotificationService.create(
            targetUserId,
            "INVITE",
            `Bạn được mời vào household "${household.name}"`
        );

        return membership;
    },

    /**
     * Thay đổi role thành viên — chỉ owner mới được thay đổi
     */
    async changeMemberRole(requesterId, membershipId, newRole) {
        // Validate role
        if (!newRole) {
            throw { status: 400, message: "role is required" };
        }

        const allowedRoles = ["admin", "member"];
        if (!allowedRoles.includes(newRole)) {
            throw { status: 400, message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}` };
        }

        // Tìm membership record
        const membership = await HouseholdModel.findMemberById(membershipId);
        if (!membership) {
            throw { status: 404, message: "Membership not found" };
        }

        // Không cho phép thay đổi role của owner
        if (membership.role === "owner") {
            throw { status: 400, message: "Cannot change the role of the household owner" };
        }

        // Kiểm tra quyền: chỉ owner mới được thay đổi role
        const requesterRole = await HouseholdModel.getMemberRole(membership.household_id, requesterId);
        if (!requesterRole || requesterRole !== "owner") {
            throw { status: 403, message: "Only the household owner can change member roles" };
        }

        // Cập nhật role
        const updatedMembership = await HouseholdModel.updateMemberRole(membershipId, newRole);

        // Auto notification
        await NotificationService.create(
            membership.user_id,
            "ROLE_CHANGE",
            `Vai trò của bạn đã được cập nhật thành "${newRole}"`
        );

        return updatedMembership;
    }
};

module.exports = HouseholdService;
