import { branchData, productData } from "@/tests/utils/test-data";
import { productService } from "./product.service";
import prisma from "@/config/db.config";

jest.mock("@/config/db.config", () => ({
  product: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Product", () => {
    it("should create a product", async () => {
      const { id, ...product } = productData;
      const { id: branchId, ..._branch } = branchData;

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (cb) => await cb(prisma),
      );

      (prisma.product.create as jest.Mock).mockResolvedValue(productData);
      //get the branchId and add the product to the branchProduct table and reference the branchId and productId
      (prisma.branchProduct.create as jest.Mock).mockResolvedValue({
        branchId,
        productId: productData.id,
      });

      const result = await productService.create({ branchId, product });

      expect(result).toEqual(productData);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.product.create).toHaveBeenCalledWith({ data: productData });
      expect(prisma.branchProduct.create).toHaveBeenCalledWith({
        data: { branchId, productId: productData.id },
      });
    });
  });

  describe("Update Product", () => {
    it("should create a product", async () => {
      const { id, ...product } = productData;

      (prisma.product.update as jest.Mock).mockResolvedValue(productData);

      const result = await productService.update({ id, productData: product });

      expect(result).toEqual(productData);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productData.id },
        data: productData,
      });
    });
  });

  describe("Delete Product", () => {
    it("should create a product", async () => {
      (prisma.product.delete as jest.Mock).mockResolvedValue(null);

      const result = await productService.remove({ id: productData.id });

      expect(result).toEqual(productData);
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: productData.id },
      });
    });
  });

  describe("Get All Products", () => {
    it("should get all products", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([productData]);

      const result = await productService.getAll();

      expect(result).toEqual([productData]);
      expect(prisma.product.findMany).toHaveBeenCalled();
    });
  });

  describe("Get Product By Id", () => {
    it("should get a product by id", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(productData);

      const result = await productService.getById(productData.id);

      expect(result).toEqual(productData);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productData.id },
      });
    });
  });

  describe("Get Products By Category", () => {
    it("should get products by category", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([productData]);

      const result = await productService.getByCategory({
        category: productData.category,
        branchId: branchData.id,
      });

      expect(result).toEqual([productData]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { category: productData.category },
      });
    });
  });

  describe("Get Products By Branch", () => {
    it("should get products by branch", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([productData]);

      const result = await productService.getByBranch({
        branchId: branchData.id,
      });

      expect(result).toEqual([productData]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { branchProducts: { some: { branchId: branchData.id } } },
      });
    });
  });
});
