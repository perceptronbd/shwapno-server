import { userData } from "@/tests/utils/test-data";
import { validateAuth } from "./auth.validate";

describe("Auth Validator", () => {
  const { email, password } = userData;
  const rememberMe = true;
  describe("Login", () => {
    it("should validate a valid login request", () => {
      const request = {
        body: {
          email,
          password,
          rememberMe,
        },
      };

      expect(() => validateAuth.login.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid login request", () => {
      const request = {
        body: {
          email,
        },
      };

      expect(() => validateAuth.login.parse(request)).toThrow();
    });

    it("should throw an error for an invalid login request", () => {
      const request = {
        body: {
          password,
        },
      };

      expect(() => validateAuth.login.parse(request)).toThrow();
    });

    it("should throw an error for an invalid login request", () => {
      const request = {
        body: {
          email,
          password,
        },
      };

      expect(() => validateAuth.login.parse(request)).toThrow();
    });
  });

  describe("Reset Password", () => {
    it("should validate a valid reset password request", () => {
      const request = {
        body: {
          email,
          password,
        },
      };

      expect(() => validateAuth.resetPassword.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid reset password request", () => {
      const request = {
        body: {},
      };

      expect(() => validateAuth.resetPassword.parse(request)).toThrow();
    });
  });
});
