import { clearCookieAndHeader, setCookie } from "@utils/cookie.util";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { authService } from "../services/auth.service";
import { userData } from "@/tests/utils/test-data";
import { authController } from "./auth.controller";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("@utils/cookie.util");
jest.mock("../services/auth.service");

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Login Admin", () => {
    it("should login admin with rememberMe true", async () => {
      const { email, password } = userData;

      const rememberMe = true;

      const { req, res } = mocks.createMockReqRes({
        body: { email, password, rememberMe },
      });

      const mockResult = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        user: {
          id: 1,
          firstName: "MD Shohag",
          phone: "01712345678",
          email,
          policy: {
            roles: ["admin"],
            permissions: ["CREATE:ALL"],
          },
        },
      };

      (authService.login as jest.Mock).mockResolvedValue(mockResult);

      await authController.login(req as Request, res as Response);

      expect(authService.login).toHaveBeenCalledWith({
        email,
        password,
        rememberMe,
      });
      expect(setCookie).toHaveBeenCalledWith(
        res,
        "refreshToken",
        mockResult.refreshToken,
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        "Authorization",
        `Bearer ${mockResult.accessToken}`,
      );
    });

    it("should login admin with rememberMe false", async () => {
      const { email, password } = userData;

      const rememberMe = false;

      const { req, res } = mocks.createMockReqRes({
        body: { email, password, rememberMe },
      });

      const mockResult = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        user: {
          id: 1,
          email,
          roles: ["admin"],
        },
      };

      (authService.login as jest.Mock).mockResolvedValue(mockResult);

      await authController.login(req as Request, res as Response);

      expect(authService.login).toHaveBeenCalledWith({
        email,
        password,
        rememberMe,
      });
      expect(setCookie).toHaveBeenCalledWith(
        res,
        "refreshToken",
        mockResult.refreshToken,
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        "Authorization",
        `Bearer ${mockResult.accessToken}`,
      );
    });

    it("should handle errors", async () => {
      const { email, password } = userData;

      const rememberMe = true;

      const { req, res } = mocks.createMockReqRes({
        body: { email, password, rememberMe },
      });

      (authService.login as jest.Mock).mockRejectedValue(new Error("Error"));

      await expect(
        authController.login(req as Request, res as Response),
      ).rejects.toThrow("Error");

      expect(authService.login).toHaveBeenCalledWith({
        email,
        password,
        rememberMe,
      });
      expect(sendResponse).not.toHaveBeenCalled();
    });

    it("should handle invalid credentials", async () => {
      const { email, password } = userData;

      const rememberMe = true;

      const { req, res } = mocks.createMockReqRes({
        body: { email, password, rememberMe },
      });

      (authService.login as jest.Mock).mockRejectedValue(
        new Error("Invalid credentials"),
      );

      await expect(
        authController.login(req as Request, res as Response),
      ).rejects.toThrow("Invalid credentials");

      expect(authService.login).toHaveBeenCalledWith({
        email,
        password,
        rememberMe,
      });
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("Logout", () => {
    it("should logout user", async () => {
      const { req, res } = mocks.createMockReqRes();

      await authController.logout(req as Request, res as Response);

      expect(clearCookieAndHeader).toHaveBeenCalledWith(res);
    });
  });

  describe("Reset Password", () => {
    it("should reset password", async () => {
      const { email, password } = userData;
      const { password: _, ...restUser } = userData;

      const { req, res } = mocks.createMockReqRes({
        body: { email, password },
      });

      (authService.resetPassword as jest.Mock).mockResolvedValue({
        ...restUser,
      });

      await authController.resetPassword(req as Request, res as Response);

      expect(authService.resetPassword).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        null,
        HTTP_STATUS_CODES.OK,
        "Password updated successfully!",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes();

      (authService.resetPassword as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        authController.resetPassword(req as Request, res as Response),
      ).rejects.toThrow("Error");

      expect(sendResponse).not.toHaveBeenCalled();
    });
  });
});
