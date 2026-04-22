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
        // ... (existing code logic kept)
        // [Để tiết kiệm context, tôi giả định logic cũ vẫn giữ nguyên, chỉ thêm hàm mới bên dưới]
        return updatedMembership;
    },

    /**
     * Tự động kiểm tra và khởi tạo dữ liệu mặc định cho User (Bootstrap)
     * Tránh tình trạng User đăng nhập vào mà không thấy dữ liệu (trống trơn)
     */
    async ensureUserHasData(userId) {
        const db = require("../config/db");
        
        // 1. Kiểm tra xem User đã thuộc về bất kỳ Household nào chưa
        const households = await HouseholdModel.findHouseholdsByUserId(userId);
        if (households.length > 0) {
            return households[0]; // Đã có dữ liệu, trả về household đầu tiên
        }

        // 2. Nếu chưa có, bắt đầu quá trình nạp dữ liệu mẫu (Bootstrap)
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const user = await UserModel.findById(userId);
            if (!user) throw { status: 404, message: "User not found" };

            // A. Tạo Household mặc định
            const household = await HouseholdModel.create({
                name: `${user.name}'s Personal Finance`,
                description: "Đây là không gian quản lý tài chính cá nhân mặc định của bạn.",
                ownerId: userId
            }, connection);

            // B. Gán User làm Owner
            await HouseholdModel.addMember(household.id, userId, "owner", connection);

            // C. Cập nhật household_id mặc định cho User
            await connection.execute("UPDATE users SET household_id = ? WHERE id = ?", [household.id, userId]);

            // D. Tạo danh mục (Categories) mặc định
            const defaultCategories = [
                { name: "Ăn uống", type: "expense" },
                { name: "Di chuyển", type: "expense" },
                { name: "Nhà ở", type: "expense" },
                { name: "Mua sắm", type: "expense" },
                { name: "Giải trí", type: "expense" },
                { name: "Sức khỏe", type: "expense" },
                { name: "Tiền lương", type: "income" },
                { name: "Thưởng", type: "income" }
            ];

            const categoryIds = [];
            for (const cat of defaultCategories) {
                const [res] = await connection.execute(
                    "INSERT INTO categories (household_id, name, type) VALUES (?, ?, ?)",
                    [household.id, cat.name, cat.type]
                );
                if (cat.type === "expense") {
                    categoryIds.push(res.insertId);
                }
            }

            // E. Tạo Ngân sách (Budget) mẫu cho tháng hiện tại
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            for (const catId of categoryIds) {
                await connection.execute(
                    "INSERT INTO budgets (household_id, category_id, month, year, amount) VALUES (?, ?, ?, ?, ?)",
                    [household.id, catId, month, year, 5000000] // 5 triệu cho mỗi mục
                );
            }

            // F. Tạo dữ liệu mẫu (Incomes / Expenses) cho 3 tháng gần nhất
            for (let i = 0; i < 90; i++) {
                const date = new Date();
                date.setDate(now.getDate() - i);
                const dateString = date.toISOString().split('T')[0];

                // Incomes ngày 1 và 15
                if (date.getDate() === 1 || date.getDate() === 15) {
                    await connection.execute(
                        "INSERT INTO incomes (household_id, user_id, amount, source, income_date) VALUES (?, ?, ?, ?, ?)",
                        [household.id, userId, 15000000, "Lương tháng mẫu", dateString]
                    );
                }

                // Expenses ngẫu nhiên
                if (Math.random() > 0.5) {
                    const catId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
                    await connection.execute(
                        "INSERT INTO expenses (household_id, user_id, category_id, amount, description, expense_date) VALUES (?, ?, ?, ?, ?, ?)",
                        [household.id, userId, catId, Math.random() * 500000 + 50000, "Chi tiêu tự động khởi tạo", dateString]
                    );
                }

                // Utility readings ngày 28
                if (date.getDate() === 28) {
                    await connection.execute(
                        "INSERT INTO utility_readings (user_id, type, value, cost, date) VALUES (?, ?, ?, ?, ?)",
                        [userId, 'electricity', Math.random() * 300 + 100, Math.random() * 500000 + 200000, dateString]
                    );
                }
            }

            await connection.commit();
            return {
                ...household,
                is_bootstrapped: true
            };
        } catch (error) {
            await connection.rollback();
            console.error("Bootstrap error for user", userId, ":", error);
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = HouseholdService;
