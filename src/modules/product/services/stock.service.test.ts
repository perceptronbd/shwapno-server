import { stockData, userData } from "@/tests/utils/test-data";
import { stockModel } from "../models/stock.model";
import { stockService } from "./stock.service";
import prisma from "@/config/db.config";

jest.mock("@/config/db.config", () => ({
  stock: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));
jest.mock("../models/stock.model", () => ({
  stockModel: { addStock: jest.fn(), getAll: jest.fn() },
}));

describe("Stock Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Stock", () => {
    it("should create a stock", async () => {
      const { id, ...stock } = stockData;

      (prisma.stock.create as jest.Mock).mockResolvedValue(stockData);

      const result = await stockService.create(stock);

      expect(result).toEqual(stockData);
      expect(prisma.stock.create).toHaveBeenCalledWith({
        data: stock,
      });
    });
  });

  describe("Add Stock", () => {
    it("should add a stock", async () => {
      const { id, branchId, ...stock } = stockData;

      (stockModel.addStock as jest.Mock).mockResolvedValue(stockData);

      const result = await stockService.add({ branchId, data: stock });

      expect(result).toEqual(stockData);
      expect(stockModel.addStock).toHaveBeenCalledWith({
        branchId: stockData.branchId,
        productId: stockData.productId,
        quantity: stockData.quantity,
      });
    });
  });

  describe("Delete Stock", () => {
    it("should delete a stock", async () => {
      const { id, ..._stock } = stockData;

      (prisma.stock.delete as jest.Mock).mockResolvedValue(stockData);

      const result = await stockService.remove({ id });

      expect(result).toEqual(stockData);
      expect(prisma.stock.delete).toHaveBeenCalledWith({
        where: { id: stockData.id },
      });
    });
  });

  //WARN: this test might be broken
  describe("Get All Stocks (by company)", () => {
    it("should get all stocks by company id", async () => {
      const mockResult = [stockData];

      (stockModel.getAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await stockService.getAll({
        id: userData.id,
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(mockResult);
      expect(stockModel.getAll).toHaveBeenCalled();
    });
  });

  describe("Get Stock By Id", () => {
    it("should get a stock by id", async () => {
      (prisma.stock.findUnique as jest.Mock).mockResolvedValue(stockData);

      const result = await stockService.getById({ id: stockData.id });

      expect(result).toEqual(stockData);
      expect(prisma.stock.findUnique).toHaveBeenCalledWith({
        where: { id: stockData.id },
      });
    });
  });

  describe("Get Stock By Branch", () => {
    it("should get a stock by branch", async () => {
      const mockResult = [stockData];

      (prisma.stock.findMany as jest.Mock).mockResolvedValue(mockResult);

      const result = await stockService.getByBranch({
        branchId: stockData.branchId,
      });

      expect(result).toEqual(mockResult);
      expect(prisma.stock.findMany).toHaveBeenCalledWith({
        where: { branchId: stockData.branchId },
      });
    });
  });
});
