import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { userService } from "../services/user.service";
import { userProfile } from "@/tests/utils/test-data";
import { TPermissions } from "@/modules/auth/types";
import { userController } from "./user.controller";
import { Action, Resource } from "@prisma/client";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("@utils/cookie.util");
jest.mock("../services/user.service");

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Profile Data", () => {
    it("should get profile data", async () => {
      const { req, res } = mocks.createMockReqRes({
        user: {
          id: userProfile.id,
          email: userProfile.email,
          policy: {
            roles: ["admin"],
            permissions: [
              `${Action.READ}:${Resource.ALL}` as unknown as TPermissions,
            ],
          },
        },
      });

      (userService.getProfile as jest.Mock).mockResolvedValue(userProfile);

      await userController.getProfile(req as Request, res as Response);

      expect(userService.getProfile).toHaveBeenCalledWith(userProfile.id);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        userProfile,
        HTTP_STATUS_CODES.OK,
        "Profile data fetched successfully",
      );
    });
  });
});
