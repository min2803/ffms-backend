const CategoryService = require("../services/categoryService");

const CategoryController = {
    /**
     * Tạo category mới
     */
    async createCategory(req, res) {
        try {
            const { name, type } = req.body;
            const category = await CategoryService.createCategory({ name, type });

            return res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Create category error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy tất cả categories
     */
    async getCategories(req, res) {
        try {
            const householdId = req.householdId;
            const categories = await CategoryService.getAllCategories(householdId);

            return res.status(200).json({
                success: true,
                message: "Categories retrieved successfully",
                data: categories
            });
        } catch (error) {
            console.error("Get categories error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Lấy category theo ID
     */
    async getCategoryById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID"
                });
            }

            const category = await CategoryService.getCategoryById(id);

            return res.status(200).json({
                success: true,
                message: "Category retrieved successfully",
                data: category
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Get category error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Cập nhật category
     */
    async updateCategory(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID"
                });
            }

            const { name, type } = req.body;
            const category = await CategoryService.updateCategory(id, { name, type });

            return res.status(200).json({
                success: true,
                message: "Category updated successfully",
                data: category
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Update category error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    /**
     * Xóa category
     */
    async deleteCategory(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID"
                });
            }

            await CategoryService.deleteCategory(id);

            return res.status(200).json({
                success: true,
                message: "Category deleted successfully"
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error("Delete category error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = CategoryController;
