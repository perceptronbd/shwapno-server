import { clearCookieAndHeader, setCookie } from "@utils/cookie.util";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { authService } from "../services/auth.service";
import { ownerData } from "@/tests/utils/test-data";
import { authController } from "./auth.controller";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

//mock imports
jest.mock("../services/auth.service");
jest.mock("@utils/cookie.util");
jest.mock("@handlers/response.handler");

describe("create password", () => {
  it("should create password", async () => {
    const { id, ...owner } = ownerData;

    const { req, res } = mocks.createMockReqRes({
      body: { ...owner },
      params: { ownerId: id },
    });

    (authService.createPassword as jest.Mock).mockResolvedValueOnce(undefined);

    await authController.createPassword(req as Request, res as Response);

    expect(authService.createPassword).toHaveBeenCalledWith({
      ownerId: ownerData.id,
      password: ownerData.password,
    });
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      null,
      HTTP_STATUS_CODES.CREATED,
      "Password created successfully",
    );
  });
});

describe("login", () => {
  it("should login & set cookies, headers and send response", async () => {
    const { req, res } = mocks.createMockReqRes({
      body: { email: ownerData.email, password: ownerData.password },
    });

    res.setHeader = jest.fn();

    const mockResult = {
      ...ownerData,
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };

    (authService.login as jest.Mock).mockResolvedValueOnce(mockResult);

    await authController.login(req as Request, res as Response);

    expect(authService.login).toHaveBeenCalledWith({
      email: ownerData.email,
      password: ownerData.password,
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
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      { ...mockResult, password: undefined, refreshToken: undefined },
      HTTP_STATUS_CODES.OK,
      "Logged in successfully!",
    );
  });

  it("should handle login error", async () => {
    const mockError = new Error("Service error");
    const { req, res } = mocks.createMockReqRes({
      body: { email: ownerData.email, password: ownerData.password },
    });

    (authService.login as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(
      authController.login(req as Request, res as Response),
    ).rejects.toThrow("Service error");

    expect(authService.login).toHaveBeenCalledWith({
      email: ownerData.email,
      password: ownerData.password,
    });
    expect(sendResponse).not.toHaveBeenCalled();
  });

  it("should login with rememberMe", async () => {
    const { req, res } = mocks.createMockReqRes({
      body: {
        email: ownerData.email,
        password: ownerData.password,
        rememberMe: true,
      },
    });

    res.setHeader = jest.fn();

    const mockResult = {
      ...ownerData,
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };

    (authService.login as jest.Mock).mockResolvedValueOnce(mockResult);

    await authController.login(req as Request, res as Response);

    expect(authService.login).toHaveBeenCalledWith({
      email: ownerData.email,
      password: ownerData.password,
      rememberMe: true,
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
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      { ...mockResult, password: undefined, refreshToken: undefined },
      HTTP_STATUS_CODES.OK,
      "Logged in successfully!",
    );
  });
});

describe("logout", () => {
  it("should create password", async () => {
    const { req, res } = mocks.createMockReqRes();

    await authController.logout(req as Request, res as Response);

    expect(clearCookieAndHeader).toHaveBeenCalledWith(res);
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      null,
      HTTP_STATUS_CODES.OK,
      "Logged out successfully!",
    );
  });
});
