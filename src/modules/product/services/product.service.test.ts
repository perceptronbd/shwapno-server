import { uploadImage, deleteImage } from "@/utils/cloudinary.util";
import { productModel } from "../models/product.model";
import { productData } from "@/tests/utils/test-data";
import { productService } from "./product.service";
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
jest.mock("@/utils/cloudinary.util", () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
}));
jest.mock("../models/product.model");

const branchData = {
  id: "1",
};
const { imgURL, imgPublicId, ...restProducts } = productData;
const imgUploadResult = {
  secure_url: "http://example.com/image.png",
  public_id: "publicId",
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
      (productModel.createProduct as jest.Mock).mockResolvedValue(restProducts);

      const result = await productService.create({
        branchId: branchData.id,
        productData: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
          categoryId: productData.categoryId,
        },
      });

      expect(result).toEqual({ ...restProducts });
      expect(productModel.createProduct).toHaveBeenCalled();
    });

    it("should create a product with an image", async () => {
      (productModel.createProduct as jest.Mock).mockResolvedValue(productData);
      (uploadImage as jest.Mock).mockResolvedValue(imgUploadResult);

      const result = await productService.create({
        branchId: branchData.id,
        productData: {
          name: productData.name,
          price: productData.price,
          quantity: "0",
          barcode: productData.barcode,
          description: productData.description,
          categoryId: productData.categoryId,
        },
        filePath: "filePaht",
        mimetype: "image/png",
      });

      expect(uploadImage).toHaveBeenCalledWith(
        "filePaht",
        "image/png",
        "product",
      );
      expect(result).toEqual(productData);
      expect(productModel.createProduct).toHaveBeenCalledWith({
        data: {
          name: productData.name,
          price: productData.price,
          quantity: "0",
          barcode: productData.barcode,
          description: productData.description,
          categoryId: productData.categoryId,
        },
        branchId: branchData.id,
        imgUploadResult,
      });
    });

    it("should delete the image if an error occurs", async () => {
      (uploadImage as jest.Mock).mockResolvedValue(imgUploadResult);
      (productModel.createProduct as jest.Mock).mockRejectedValue(new Error());
      (deleteImage as jest.Mock).mockResolvedValue({ result: "success" });

      await expect(
        productService.create({
          branchId: branchData.id,
          productData: {
            name: productData.name,
            price: productData.price,
            quantity: "0",
            barcode: productData.barcode,
            description: productData.description,
            categoryId: productData.categoryId,
          },
          filePath: "filePaht",
          mimetype: "image/png",
        }),
      ).rejects.toThrow();

      expect(deleteImage).toHaveBeenCalledWith(imgUploadResult.public_id);
      expect(productModel.createProduct).toHaveBeenCalled();
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
      (uploadImage as jest.Mock).mockResolvedValue(imgUploadResult);
      (deleteImage as jest.Mock).mockResolvedValue({ result: "success" });
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(productData);
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...productData,
        imgURL: imgUploadResult.secure_url,
        imgPublicId: imgUploadResult.public_id,
      });

      const result = await productService.update({
        id: productData.id,
        productData: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
        },
        filePath: "filePaht",
        mimetype: "image/png",
      });

      expect(uploadImage).toHaveBeenCalledWith(
        "filePaht",
        "image/png",
        "product",
      );
      expect(result).toEqual({
        ...restProducts,
        imgURL: imgUploadResult.secure_url,
        imgPublicId: imgUploadResult.public_id,
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productData.id },
        data: {
          name: productData.name,
          price: productData.price,
          barcode: productData.barcode,
          description: productData.description,
          imgURL: imgUploadResult.secure_url,
          imgPublicId: imgUploadResult.public_id,
        },
      });
      expect(deleteImage).toHaveBeenCalled();
    });

    it("should delete the image if an error occurs", async () => {
      (uploadImage as jest.Mock).mockResolvedValue(imgUploadResult);
      (deleteImage as jest.Mock).mockResolvedValue({ result: "success" });
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(productData);
      (prisma.product.update as jest.Mock).mockRejectedValue(new Error());

      await expect(
        productService.update({
          id: productData.id,
          productData: {
            name: productData.name,
            price: productData.price,
            barcode: productData.barcode,
            description: productData.description,
          },
          filePath: "filePaht",
          mimetype: "image/png",
        }),
      ).rejects.toThrow();

      expect(deleteImage).toHaveBeenCalledWith(imgUploadResult.public_id);
      expect(prisma.product.update).toHaveBeenCalled();
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
