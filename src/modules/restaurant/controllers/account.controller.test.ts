import { accountController } from "@/modules/restaurant/controllers/account.controller";
import { accountService } from "@modules/restaurant/services/account.service";
import { basicRestaurantData } from "@/tests/utils/test-data";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@modules/restaurant/services/account.service");
jest.mock("@handlers/response.handler");

afterEach(() => {
  jest.clearAllMocks();
});

describe("basic", () => {
  it("should call accountService.basic and sendResponse with success", async () => {
    const { req, res } = mocks.createMockReqRes({
      body: { ...basicRestaurantData },
    });

    const mockResult = {
      newRestaurant: {},
      newOwner: {},
    };

    (accountService.basic as jest.Mock).mockResolvedValue(mockResult);

    await accountController.basic(req as Request, res as Response);

    expect(accountService.basic).toHaveBeenCalledWith(req.body);
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      mockResult,
      HTTP_STATUS_CODES.CREATED,
      "Basic Information created successfully",
    );
  });

  it("should handle errors from accountService.basic", async () => {
    const mockError = new Error("Service error");
    const { req, res } = mocks.createMockReqRes({
      body: { ...basicRestaurantData },
    });

    (accountService.basic as jest.Mock).mockRejectedValue(mockError);

    await expect(
      accountController.basic(req as Request, res as Response),
    ).rejects.toThrow("Service error");

    expect(accountService.basic).toHaveBeenCalledWith(req.body);
    expect(sendResponse).not.toHaveBeenCalled();
  });
});

describe("location", () => {
  it("should call accountService.location and sendResponse with success", async () => {
    const mockResult = { updatedLocation: {} };
    const { req, res } = mocks.createMockReqRes({
      body: { ...basicRestaurantData },
      params: { restaurantId: "12345" },
    });

    (accountService.location as jest.Mock).mockResolvedValue(mockResult);

    await accountController.location(req as Request, res as Response);

    expect(accountService.location).toHaveBeenCalledWith({
      restaurantId: "12345",
      ...req.body.location,
    });
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      mockResult,
      HTTP_STATUS_CODES.OK,
      "Location Information created successfully",
    );
  });

  it("should handle errors from accountService.location", async () => {
    const mockError = new Error("Service error");
    const { req, res } = mocks.createMockReqRes({
      body: { ...basicRestaurantData },
      params: { restaurantId: "12345" },
    });

    (accountService.location as jest.Mock).mockRejectedValue(mockError);

    await expect(
      accountController.location(req as Request, res as Response),
    ).rejects.toThrow("Service error");

    expect(accountService.location).toHaveBeenCalledWith({
      restaurantId: "12345",
      ...req.body.location,
    });
    expect(sendResponse).not.toHaveBeenCalled(); // sendResponse is not called on error
  });
});
