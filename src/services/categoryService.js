const CategoryModel = require("../models/categoryModel");

const CategoryService = {
    async createCategory(userId, householdId, { name, type }) {
        if (!name || name.trim().length === 0) {
            throw { status: 400, message: "Category name is required" };
        }
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }

        // Kiểm tra trùng tên trong cùng một household
        const existing = await CategoryModel.findByName(householdId, name.trim());
        if (existing) {
            throw { status: 409, message: "Category with this name already exists in your household" };
        }

        const category = await CategoryModel.create({
            householdId,
            name: name.trim(),
            type: type ? type.trim() : null
        });

        return category;
    },

    /**
     * Lấy tất cả categories của household
     */
    async getAllCategories(householdId, type) {
        if (!householdId) {
            throw { status: 400, message: "householdId is required" };
        }
        
        let categories = await CategoryModel.findAllByHousehold(householdId);
        
        if (type) {
            categories = categories.filter(c => c.type === type);
            
            // Nếu type là 'income', sắp xếp theo đúng thứ tự: Lương, Đầu tư, Khác
            if (type === 'income') {
                const order = { "Lương": 1, "Đầu tư": 2, "Khác": 3 };
                categories.sort((a, b) => {
                    const orderA = order[a.name] || 99;
                    const orderB = order[b.name] || 99;
                    return orderA - orderB;
                });
            }
        }
        
        return categories;
    },

    /**
     * Lấy category theo ID
     */
    async getCategoryById(id) {
        const category = await CategoryModel.findById(id);
        if (!category) {
            throw { status: 404, message: "Category not found" };
        }
        return category;
    },

    /**
     * Cập nhật category
     */
    async updateCategory(id, householdId, { name, type }) {
        if (!name || name.trim().length === 0) {
            throw { status: 400, message: "Category name is required" };
        }

        const category = await CategoryModel.findById(id);
        if (!category) {
            throw { status: 404, message: "Category not found" };
        }

        // Kiểm tra category thuộc household của requester
        if (category.household_id !== householdId) {
            throw { status: 403, message: "You do not have permission to update this category" };
        }

        // Kiểm tra trùng tên (trừ chính nó) trong cùng household
        const existing = await CategoryModel.findByName(category.household_id, name.trim());
        if (existing && existing.id !== id) {
            throw { status: 409, message: "Category with this name already exists in your household" };
        }

        await CategoryModel.updateById(id, {
            name: name.trim(),
            type: type ? type.trim() : null
        });

        return {
            id,
            name: name.trim(),
            type: type ? type.trim() : null
        };
    },

    /**
     * Xóa category
     */
    async deleteCategory(id, householdId) {
        const category = await CategoryModel.findById(id);
        if (!category) {
            throw { status: 404, message: "Category not found" };
        }

        // Kiểm tra category thuộc household của requester
        if (category.household_id !== householdId) {
            throw { status: 403, message: "You do not have permission to delete this category" };
        }

        await CategoryModel.deleteById(id);
        return { message: "Category deleted successfully" };
    }
};

module.exports = CategoryService;
