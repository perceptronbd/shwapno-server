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
jest.mock("../models/product.model", () => ({
  productModel: {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

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

  describe("Get By Branch", () => {
    it("should get products by branch with pagination", async () => {
      const page = 1;

      const mockFilteredProducts = [productData].map((product) => ({
        imgURL: product.imgURL,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        category: product.category,
      }));

      (productModel.get as jest.Mock).mockResolvedValue(mockFilteredProducts);

      const result = await productService.getByBranch({
        branchId: branchData.id,
        limit: 10,
        page,
      });

      expect(result).toEqual(mockFilteredProducts);
      expect(productModel.get).toHaveBeenCalledWith({
        branchId: branchData.id,
        limit: 10,
        page,
      });
    });
  });
});
