import { validateQR } from "./qr.validator";

describe("QR Validator", () => {
  describe("get", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { branchId: "branch-123" },
      };

      expect(() => validateQR.get.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { branchId: null },
      };

      expect(() => validateQR.get.parse(request)).toThrow();
    });

    it("should throw an error when branchId is missing", () => {
      const request = {
        params: {},
      };

      expect(() => validateQR.get.parse(request)).toThrow();
    });
  });

  describe("create", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { branchId: "branch-123" },
      };

      expect(() => validateQR.create.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { branchId: null },
      };

      expect(() => validateQR.create.parse(request)).toThrow();
    });

    it("should throw an error when branchId is missing", () => {
      const request = {
        params: {},
      };

      expect(() => validateQR.create.parse(request)).toThrow();
    });
  });
});
