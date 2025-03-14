import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { branchService } from "../services/branch.service";
import { branchController } from "./branch.controller";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

jest.mock("@/handlers/response.handler");
jest.mock("../services/branch.service");

describe("Branch Controller", () => {
  describe("getByName", () => {
    it("should return branch data", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { name: "Main Branch" },
      });

      (branchService.getByName as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Main Branch",
      });

      await branchController.getByName(req as Request, res as Response);

      expect(branchService.getByName).toHaveBeenCalledWith("Main Branch");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        { id: 1, name: "Main Branch" },
        HTTP_STATUS_CODES.OK,
        "Branch retrieved successfully",
      );
    });
  });
});
