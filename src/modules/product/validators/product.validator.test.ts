import { IMAGE_MIME, MAX_FILE_SIZE } from "../types/image.type";
import { validateProduct } from "./product.validator";

describe("Product Validator", () => {
  describe("Create Product", () => {
    it("should validate a valid product with an image", () => {
      const request = {
        body: {
          name: "Test Product",
          price: 100.0,
          barcode: "1234567890",
          branchId: "1",
          description: "",
        },
        file: {
          mimetype: IMAGE_MIME.PNG,
          size: MAX_FILE_SIZE - 1,
        },
      };

      expect(() => validateProduct.create.parse(request)).not.toThrow();
    });

    it("should validate a valid product without an image", () => {
      const request = {
        body: {
          name: "Test Product",
          price: 100.0,
          barcode: "1234567890",
          branchId: "1",
          description: "",
        },
      };

      expect(() => validateProduct.create.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid product", () => {
      const request = {
        body: { name: "", price: -100, barcode: "", branchId: "" },
      };

      expect(() => validateProduct.create.parse(request)).toThrow();
    });
    it("should throw an error for an invalid product image size and type", () => {
      const request = {
        body: { name: "name", price: 100, barcode: "123490" },
        file: {
          mimetype: "invalid/type",
          size: MAX_FILE_SIZE + 1,
        },
      };

      expect(() => validateProduct.create.parse(request)).toThrow();
    });
  });

  describe("Update Product", () => {
    it("should validate a valid product without an image", () => {
      const request = {
        body: {
          name: "Test Product",
          price: 100.0,
          barcode: "1234567890",
          description: "",
        },
        params: { id: "1" },
      };

      expect(() => validateProduct.update.parse(request)).not.toThrow();
    });
    it("should validate a valid product with an image", () => {
      const request = {
        body: {
          name: "Test Product",
          price: 100.0,
          barcode: "1234567890",
          description: "",
        },
        params: { id: "1" },
        file: {
          mimetype: IMAGE_MIME.JPEG,
          size: MAX_FILE_SIZE - 1,
        },
      };

      expect(() => validateProduct.update.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid product", () => {
      const request = {
        body: { name: "", price: -100, barcode: "" },
        params: { id: "1" },
        file: {
          mimetype: "invalid/type",
          size: MAX_FILE_SIZE + 1,
        },
      };

      expect(() => validateProduct.update.parse(request)).toThrow();
    });
  });

  describe("Delete Product", () => {
    it("should validate a valid product", () => {
      const request = {
        params: { id: "1" },
      };

      expect(() => validateProduct.remove.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid product", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateProduct.remove.parse(request)).toThrow();
    });
  });

  describe("Get All Products", () => {
    it("should validate a valid request", () => {
      const request = {
        query: { page: 1, limit: 10 },
      };

      expect(() => validateProduct.getAll.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        query: { page: "invalid", limit: "invalid" },
      };

      expect(() => validateProduct.getAll.parse(request)).toThrow();
    });
  });

  describe("Get Product By Id", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "1" },
      };

      expect(() => validateProduct.getById.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateProduct.getById.parse(request)).toThrow();
    });
  });

  describe("Get Products By Category", () => {
    it("should validate a valid request", () => {
      const request = {
        query: { category: "Test Category" },
        params: { branchId: "1" },
      };

      expect(() => validateProduct.getByCategory.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        query: { category: "" },
      };

      expect(() => validateProduct.getByCategory.parse(request)).toThrow();
    });
  });

  describe("Get Products By Branch", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { branchId: "1" },
        query: { page: 1, limit: 10 },
      };

      expect(() => validateProduct.getByBranch.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { branchId: null },
      };

      expect(() => validateProduct.getByBranch.parse(request)).toThrow();
    });
  });
});
