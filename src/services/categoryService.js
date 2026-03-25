const CategoryModel = require("../models/categoryModel");

const CategoryService = {
    /**
     * Tạo category mới
     */
    async createCategory({ name, type }) {
        if (!name || name.trim().length === 0) {
            throw { status: 400, message: "Category name is required" };
        }

        // Kiểm tra trùng tên
        const existing = await CategoryModel.findByName(name.trim());
        if (existing) {
            throw { status: 409, message: "Category with this name already exists" };
        }

        const category = await CategoryModel.create({
            name: name.trim(),
            type: type ? type.trim() : null
        });

        return category;
    },

    /**
     * Lấy tất cả categories
     */
    async getAllCategories() {
        const categories = await CategoryModel.findAll();
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
    async updateCategory(id, { name, type }) {
        if (!name || name.trim().length === 0) {
            throw { status: 400, message: "Category name is required" };
        }

        const category = await CategoryModel.findById(id);
        if (!category) {
            throw { status: 404, message: "Category not found" };
        }

        // Kiểm tra trùng tên (trừ chính nó)
        const existing = await CategoryModel.findByName(name.trim());
        if (existing && existing.id !== id) {
            throw { status: 409, message: "Category with this name already exists" };
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
    async deleteCategory(id) {
        const category = await CategoryModel.findById(id);
        if (!category) {
            throw { status: 404, message: "Category not found" };
        }

        await CategoryModel.deleteById(id);
        return { message: "Category deleted successfully" };
    }
};

module.exports = CategoryService;
