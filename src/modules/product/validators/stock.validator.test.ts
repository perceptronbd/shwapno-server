import { validateStock } from "./stock.validator";

describe("Stock Validator", () => {
  describe("Create Stock", () => {
    it("should validate a valid stock", () => {
      const request = {
        body: { quantity: 10, productId: "1" },
      };

      expect(() => validateStock.create.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid stock", () => {
      const request = {
        body: { quantity: -10, productId: "1" },
      };

      expect(() => validateStock.create.parse(request)).toThrow();
    });
  });

  describe("Update Stock", () => {
    it("should validate a valid stock", () => {
      const request = {
        body: { quantity: 10, productId: "1" },
        params: { id: "1" },
      };

      expect(() => validateStock.update.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid stock", () => {
      const request = {
        body: { quantity: -10, productId: "1" },
        params: { id: "1" },
      };

      expect(() => validateStock.update.parse(request)).toThrow();
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

  describe("Get All Stocks (company)", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "1" },
      };

      expect(() => validateStock.getAll.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateStock.getAll.parse(request)).toThrow();
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
        params: { id: "1" },
      };

      expect(() => validateStock.getByBranch.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateStock.getByBranch.parse(request)).toThrow();
    });
  });
});
