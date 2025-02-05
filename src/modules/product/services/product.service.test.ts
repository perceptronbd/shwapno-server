import { productService } from "./product.service";
import { uploadImage } from "@/utils/uploadImage";
import prisma from "@/config/db.config";

jest.mock("@/config/db.config", () => ({
  $transaction: jest.fn(),
  product: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  stock: {
    create: jest.fn(),
  },
}));
jest.mock("@/utils/uploadImage");

const productData = {
  id: "1",
  name: "Test Product",
  price: 100.0,
  barcode: "1234567890",
  description: "",
  category: "Test Category",
  imgURL: "",
};

const branchData = {
  id: "1",
};

describe("Product Service", () => {
  beforeEach(() => {
    (prisma.$transaction as jest.Mock).mockImplementation((fn) => fn(prisma));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Product", () => {
    it("should create a product without an image", async () => {
      (prisma.product.create as jest.Mock).mockResolvedValue(productData);
      (prisma.stock.create as jest.Mock).mockResolvedValue({});
      (prisma.product.update as jest.Mock).mockResolvedValue(productData);

      const result = await productService.create({
        branchId: branchData.id,
        productData: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
          categoryId: "1",
        },
      });

      expect(result).toEqual(productData);
      expect(prisma.product.create).toHaveBeenCalled();
      expect(prisma.stock.create).toHaveBeenCalled();
      expect(prisma.product.update).not.toHaveBeenCalled();
    });

    it("should create a product with an image", async () => {
      const imageUrl = "http://example.com/image.png";
      (uploadImage as jest.Mock).mockResolvedValue(imageUrl);
      (prisma.product.create as jest.Mock).mockResolvedValue(productData);
      (prisma.stock.create as jest.Mock).mockResolvedValue({});
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...productData,
        imgURL: imageUrl,
      });

      const result = await productService.create({
        branchId: branchData.id,
        productData: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
          categoryId: "1",
        },
        imageBuffer: Buffer.from(""),
        mimetype: "image/png",
      });

      expect(result).toEqual({ ...productData, imgURL: imageUrl });
      expect(prisma.product.create).toHaveBeenCalled();
      expect(prisma.stock.create).toHaveBeenCalled();
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productData.id },
        data: { imgURL: imageUrl },
      });
    });
  });

  describe("Update Product", () => {
    it("should update a product without an image", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(productData);
      (prisma.product.update as jest.Mock).mockResolvedValue(productData);

      const result = await productService.update({
        id: productData.id,
        productData: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
        },
      });

      expect(result).toEqual(productData);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productData.id },
        data: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
        },
      });
    });

    it("should update a product with an image", async () => {
      const imageUrl = "http://example.com/image.png";
      (uploadImage as jest.Mock).mockResolvedValue(imageUrl);
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(productData);
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...productData,
        imgURL: imageUrl,
      });

      const result = await productService.update({
        id: productData.id,
        productData: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
        },
        imageBuffer: Buffer.from(""),
        mimetype: "image/png",
      });

      expect(result).toEqual({ ...productData, imgURL: imageUrl });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productData.id },
        data: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
          imgURL: imageUrl,
        },
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
        where: {
          category: {
            name: productData.category,
          },
        },
      });
    });
  });

  describe("Get Products By Branch", () => {
    it("should get products by branch with pagination", async () => {
      const page = 1;

      const mockFilteredProducts = [productData].map((product) => ({
        imgURL: product.imgURL,
        name: product.name,
        price: product.price,
        category: product.category,
      }));

      (prisma.product.findMany as jest.Mock).mockResolvedValue(
        mockFilteredProducts,
      );

      const result = await productService.getByBranch({
        branchId: branchData.id,
        limit: 10,
        page,
      });

      expect(result).toEqual(mockFilteredProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { stock: { some: { branchId: branchData.id } } },
        take: 10,
        skip: 10 * (page - 1),
        select: {
          imgURL: true,
          name: true,
          price: true,
          category: { select: { name: true } },
        },
      });
    });
  });
});
