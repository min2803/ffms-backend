jest.mock("../../models/categoryModel");
jest.mock("../../config/db", () => ({ execute: jest.fn() }));

const CategoryModel = require("../../models/categoryModel");
const CategoryService = require("../../services/categoryService");

describe("CategoryService", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("createCategory", () => {
        test("success", async () => {
            CategoryModel.findByName.mockResolvedValue(null);
            CategoryModel.create.mockResolvedValue({ id: 1, name: "Food", type: "expense" });

            const result = await CategoryService.createCategory(1, 1, { name: "Food", type: "expense" });
            expect(result.name).toBe("Food");
        });

        test("empty name — throws 400", async () => {
            await expect(CategoryService.createCategory(1, 1, { name: "" }))
                .rejects.toEqual(expect.objectContaining({ status: 400 }));
        });

        test("duplicate name — throws 409", async () => {
            CategoryModel.findByName.mockResolvedValue({ id: 2, name: "Food" });
            await expect(CategoryService.createCategory(1, 1, { name: "Food" }))
                .rejects.toEqual(expect.objectContaining({ status: 409 }));
        });
    });

    describe("getAllCategories", () => {
        test("success", async () => {
            CategoryModel.findAllByHousehold.mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const result = await CategoryService.getAllCategories(1);
            expect(result).toHaveLength(2);
        });
    });

    describe("updateCategory", () => {
        test("wrong household — throws 403", async () => {
            CategoryModel.findById.mockResolvedValue({ id: 1, household_id: 2 });
            await expect(CategoryService.updateCategory(1, 1, { name: "New" }))
                .rejects.toEqual(expect.objectContaining({ status: 403 }));
        });
    });

    describe("deleteCategory", () => {
        test("success", async () => {
            CategoryModel.findById.mockResolvedValue({ id: 1, household_id: 1 });
            CategoryModel.deleteById.mockResolvedValue();

            const result = await CategoryService.deleteCategory(1, 1);
            expect(result.message).toBe("Category deleted successfully");
        });
    });
});
