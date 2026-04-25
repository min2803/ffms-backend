const os = require("os");
const AdminModel = require("../models/adminModel");

const VALID_ROLE_IDS = [1, 2]; // 1 = admin, 2 = user
const VALID_LOG_LEVELS = ["info", "warn", "error"];

/**
 * Helper: validate date format YYYY-MM-DD
 */
function isValidDate(dateStr) {
    if (!dateStr) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

const AdminService = {
    /**
     * GET /api/admin/summary
     * → { totalUsers, totalHouseholds, totalTransactions }
     */
    async getSummary() {
        const [totalUsers, totalHouseholds, totalTransactions] = await Promise.all([
            AdminModel.countUsers(),
            AdminModel.countHouseholds(),
            AdminModel.countTransactions()
        ]);

        return { totalUsers, totalHouseholds, totalTransactions };
    },

    /**
     * GET /api/admin/users
     * Query: { search?, page?, limit? }
     */
    async getUsers({ search, page = 1, limit = 20 }) {
        const p = Math.max(1, parseInt(page) || 1);
        const l = Math.min(100, Math.max(1, parseInt(limit) || 20));
        const offset = (p - 1) * l;

        const [users, total] = await Promise.all([
            AdminModel.searchUsers(search || null, l, offset),
            AdminModel.countSearchUsers(search || null)
        ]);

        return {
            users,
            pagination: {
                page: p,
                limit: l,
                total,
                totalPages: Math.ceil(total / l)
            }
        };
    },

    /**
     * GET /api/admin/households
     */
    async getHouseholds() {
        return await AdminModel.getAllHouseholds();
    },

    /**
     * GET /api/admin/system/health
     */
    getHealth() {
        return {
            status: "OK",
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    },

    /**
     * GET /api/admin/system/logs
     * Query: { level?, date? }
     */
    async getLogs({ level, date }) {
        if (level && !VALID_LOG_LEVELS.includes(level)) {
            throw { status: 400, message: "level must be 'info', 'warn', or 'error'" };
        }

        if (date && !isValidDate(date)) {
            throw { status: 400, message: "date must be in YYYY-MM-DD format" };
        }

        return await AdminModel.getLogs({ level: level || null, date: date || null });
    },

    /**
     * GET /api/admin/system/metrics
     */
    getMetrics() {
        const cpus = os.cpus();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;

        // Tính CPU usage trung bình
        let totalIdle = 0;
        let totalTick = 0;
        for (const cpu of cpus) {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        }
        const cpuUsage = ((1 - totalIdle / totalTick) * 100).toFixed(2);

        return {
            cpuUsage: `${cpuUsage}%`,
            memoryUsage: {
                total: `${(totalMem / 1024 / 1024).toFixed(2)} MB`,
                used: `${(usedMem / 1024 / 1024).toFixed(2)} MB`,
                free: `${(freeMem / 1024 / 1024).toFixed(2)} MB`,
                percentage: `${((usedMem / totalMem) * 100).toFixed(2)}%`
            },
            cpuCores: cpus.length
        };
    },

    /**
     * DELETE /api/admin/users/:id
     */
    async deleteUser(adminUserId, targetUserId) {
        if (adminUserId === targetUserId) {
            throw { status: 400, message: "Cannot delete your own account" };
        }

        const user = await AdminModel.findUserById(targetUserId);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        await AdminModel.deleteUser(targetUserId);
        return { message: "User deleted successfully" };
    },

    /**
     * PUT /api/admin/users/:id/role
     * Body: { role_id }
     */
    async updateUserRole(adminUserId, targetUserId, role_id) {
        const parsedRoleId = parseInt(role_id);
        if (!role_id || !VALID_ROLE_IDS.includes(parsedRoleId)) {
            throw { status: 400, message: "role_id must be 1 (admin) or 2 (user)" };
        }

        if (adminUserId === targetUserId) {
            throw { status: 400, message: "Cannot change your own role" };
        }

        const user = await AdminModel.findUserById(targetUserId);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        await AdminModel.updateUserRole(targetUserId, parsedRoleId);
        return { id: targetUserId, role_id: parsedRoleId };
    },

    /**
     * DELETE /api/admin/households/:id
     */
    async deleteHousehold(householdId) {
        const household = await AdminModel.findHouseholdById(householdId);
        if (!household) {
            throw { status: 404, message: "Household not found" };
        }

        await AdminModel.deleteHousehold(householdId);
        return { message: "Household and all related data deleted successfully" };
    }
};

module.exports = AdminService;
