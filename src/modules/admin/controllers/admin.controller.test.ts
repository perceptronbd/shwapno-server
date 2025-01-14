import { adminService } from "@modules/admin/services/admin.service";
import { clearCookieAndHeader, setCookie } from "@utils/cookie.util";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { adminController } from "./admin.controller";
import { adminData } from "@/tests/utils/test-data";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@modules/admin/services/admin.service");
jest.mock("@utils/cookie.util");
jest.mock("@handlers/response.handler");

describe("Admin Create Controller", () => {
  it("should call adminServce.create and sendResponse with success", async () => {
    const { req, res } = mocks.createMockReqRes({ body: { ...adminData } });

    const mockResult = { _id: "adminId", ...adminData };

    (adminService.create as jest.Mock).mockResolvedValue(mockResult);

    await adminController.create(req as Request, res as Response);

    expect(adminService.create).toHaveBeenCalledWith(req.body);

    expect(sendResponse).toHaveBeenCalledWith(
      res,
      mockResult,
      HTTP_STATUS_CODES.CREATED,
      "Admin created successfully!",
    );
  });
});

describe("Admin Login Controller", () => {
  it("should call adminService.login, setCookie and sendResponse with success", async () => {
    const { req, res } = mocks.createMockReqRes({
      body: { ...adminData },
    });

    res.setHeader = jest.fn();

    const mockResult = {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      ...adminData,
    };

    (adminService.login as jest.Mock).mockResolvedValue(mockResult);

    await adminController.login(req as Request, res as Response);

    expect(adminService.login).toHaveBeenCalledWith({
      email: adminData.email,
      password: adminData.password,
      rememberMe: true,
    });
    expect(setCookie).toHaveBeenCalledWith(res, "refreshToken", "refreshToken");
    expect(res.setHeader).toHaveBeenCalledWith(
      "Authorization",
      `Bearer ${mockResult.accessToken}`,
    );
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      { _id: "adminId", ...adminData },
      HTTP_STATUS_CODES.OK,
      "Logged in successfully!",
    );
  });
  it("should call clear coookies", async () => {
    const { req, res } = mocks.createMockReqRes({
      body: { ...adminData },
    });

    res.setHeader = jest.fn();

    const mockResult = {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      ...adminData,
    };

    (adminService.login as jest.Mock).mockResolvedValue(mockResult);

    await adminController.login(req as Request, res as Response);

    expect(adminService.login).toHaveBeenCalledWith({
      email: adminData.email,
      password: adminData.password,
      rememberMe: false,
    });
    expect(setCookie).toHaveBeenCalledWith(res, "refreshToken", "refreshToken");
    expect(res.setHeader).toHaveBeenCalledWith(
      "Authorization",
      `Bearer ${mockResult.accessToken}`,
    );
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      { _id: "adminId", ...adminData },
      HTTP_STATUS_CODES.OK,
      "Logged in successfully!",
    );
  });
});

describe("Admin Logout Controller", () => {
  it("should call adminService.logout and clear cookies", async () => {
    const { req, res } = mocks.createMockReqRes({
      body: { ...adminData },
    });

    await adminController.logout(req as Request, res as Response);

    expect(clearCookieAndHeader).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      null,
      HTTP_STATUS_CODES.OK,
      "Logged out successfully!",
    );
  });
});
