import { categoryData } from "@/tests/utils/test-data";
import { categoryService } from "./category.service";
import prisma from "@/config/db.config";

jest.mock("@/config/db.config", () => ({
  category: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe("Category Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Category", () => {
    it("should create a category", async () => {
      const { id, ...category } = categoryData;

      (prisma.category.create as jest.Mock).mockResolvedValue(categoryData);

      const result = await categoryService.create({ category });

      expect(result).toEqual(categoryData);
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: categoryData,
      });
    });
  });

  describe("Update Category", () => {
    it("should update a category", async () => {
      const { id, ...category } = categoryData;

      (prisma.category.update as jest.Mock).mockResolvedValue(categoryData);

      const result = await categoryService.update({ id, category });

      expect(result).toEqual(categoryData);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: categoryData.id },
        data: categoryData,
      });
    });
  });

  describe("Delete Category", () => {
    it("should delete a category", async () => {
      const { id, ..._category } = categoryData;

      (prisma.category.delete as jest.Mock).mockResolvedValue(categoryData);

      const result = await categoryService.remove({ id });

      expect(result).toEqual(categoryData);
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: categoryData.id },
      });
    });
  });

  describe("Get All Categories", () => {
    it("should get all categories", async () => {
      const categories = [categoryData];

      (prisma.category.findMany as jest.Mock).mockResolvedValue(categories);

      const result = await categoryService.getAll();

      expect(result).toEqual(categories);
      expect(prisma.category.findMany).toHaveBeenCalled();
    });
  });

  describe("Get Category By Id", () => {
    it("should get a category by id", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(categoryData);

      const result = await categoryService.getById(categoryData.id);

      expect(result).toEqual(categoryData);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: categoryData.id },
      });
    });
  });

  describe("Get Categories By Branch", () => {
    it("should get categories by branch", async () => {
      const categories = [categoryData];

      (prisma.category.findMany as jest.Mock).mockResolvedValue(categories);

      const result = await categoryService.getByBranch(categoryData.branchId);

      expect(result).toEqual(categories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { branchId: categoryData.branchId },
      });
    });
  });
});
