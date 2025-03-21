import { excelRowSchema, validateStock } from "./stock.validator";

describe("Stock Validator", () => {
  describe("Excel Row Schema", () => {
    it("should validate valid excel row data", () => {
      const validRow = {
        subCategory: "Test Category",
        productCode: "TEST001",
        productName: "Test Product",
        packSize: "500g",
        stock: "100",
        price: "150.50",
      };

      const result = excelRowSchema.safeParse(validRow);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          subCategory: "Test Category",
          productCode: "TEST001",
          productName: "Test Product",
          packSize: "500g",
          stock: 100,
          price: 150.5,
        });
      }
    });

    it("should handle optional pack size", () => {
      const rowWithoutPackSize = {
        subCategory: "Test Category",
        productCode: "TEST001",
        productName: "Test Product",
        stock: "100",
        price: "150.50",
      };

      const result = excelRowSchema.safeParse(rowWithoutPackSize);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.packSize).toBeUndefined();
      }
    });

    it("should handle stock and price with apostrophes", () => {
      const rowWithApostrophe = {
        subCategory: "Test Category",
        productCode: "TEST001",
        productName: "Test Product",
        stock: "'100'",
        price: "'150.50'",
      };

      const result = excelRowSchema.safeParse(rowWithApostrophe);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stock).toBe(100);
        expect(result.data.price).toBe(150.5);
      }
    });

    it("should reject invalid data", () => {
      const invalidRow = {
        subCategory: "",
        productCode: "",
        productName: "",
        stock: "-1",
        price: "-150.50",
      };

      const result = excelRowSchema.safeParse(invalidRow);
      expect(result.success).toBe(false);
    });

    it("should handle missing stock and price values", () => {
      const rowWithMissingValues = {
        subCategory: "Test Category",
        productCode: "TEST001",
        productName: "Test Product",
        stock: "",
        price: "",
      };

      const result = excelRowSchema.safeParse(rowWithMissingValues);
      expect(result.success).toBe(false);
      if (result.success) {
        expect(result.data.stock).toBe(0);
        expect(result.data.price).toBe(0);
      }
    });

    it("should handle zero and negative stock values", () => {
      const rowWithZeroStock = {
        subCategory: "Test Category",
        productCode: "TEST001",
        productName: "Test Product",
        stock: "0",
        price: "150.50",
      };

      const result = excelRowSchema.safeParse(rowWithZeroStock);
      expect(result.success).toBe(false);
      if (result.success) {
        expect(result.data.stock).toBeNull();
      }
    });
  });

  describe("Update Stock", () => {
    it("should validate a valid stock", () => {
      const request = {
        body: { quantity: 10, productId: "1" },
        params: { branchId: "1" },
      };

      expect(() => validateStock.add.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid stock", () => {
      const request = {
        body: { quantity: -10, productId: "1" },
        params: { branchId: "1" },
      };

      expect(() => validateStock.add.parse(request)).toThrow();
    });
  });

  describe("Delete Stock", () => {
    it("should validate a valid stock", () => {
      const request = {
        params: { id: "1" },
      };

      expect(() => validateStock.remove.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid stock", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateStock.remove.parse(request)).toThrow();
    });
  });

  describe("Get Stock By Id", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "1" },
      };

      expect(() => validateStock.getById.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateStock.getById.parse(request)).toThrow();
    });
  });

  describe("Get Stock By Branch", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { branchId: "1" },
      };

      expect(() => validateStock.getByBranch.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { branchId: null },
      };

      expect(() => validateStock.getByBranch.parse(request)).toThrow();
    });
  });
});
