const CategoryService = require("../services/categoryService");
const { handleRequest } = require("../utils/controllerHandler");

const CategoryController = {
    createCategory: handleRequest(async (req, res) => {
        const { name, type } = req.body;
        const category = await CategoryService.createCategory(req.user.userId, req.householdId, { name, type });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    }, "Create category"),

    getCategories: handleRequest(async (req, res) => {
        const householdId = req.householdId;
        const { type } = req.query;
        console.log(`[categoryController] fetching categories for householdId: ${householdId}, type: ${type}`);
        const categories = await CategoryService.getAllCategories(householdId, type);
        console.log(`[categoryController] returning ${categories.length} categories`);

        return res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories
        });
    }, "Get categories"),

    getCategoryById: handleRequest(async (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        const category = await CategoryService.getCategoryById(id);

        return res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: category
        });
    }, "Get category"),

    updateCategory: handleRequest(async (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        const { name, type } = req.body;
        const category = await CategoryService.updateCategory(id, req.householdId, { name, type });

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    }, "Update category"),

    deleteCategory: handleRequest(async (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        await CategoryService.deleteCategory(id, req.householdId);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    }, "Delete category")
};

module.exports = CategoryController;
