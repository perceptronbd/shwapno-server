import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { userService } from "../services/user.service";
import { AuthRequest } from "@/types/auth.types";
import { Request, Response } from "express";

const createUser = async (_req: Request, res: Response) => {
  res.send("Create user");
};

const getProfile = async (req: AuthRequest, res: Response) => {
  const { user } = req;

  const result = await userService.getProfile(user!.id);

  console.log(result);

  sendResponse(res, result, HTTP_STATUS_CODES.OK);
};

export const userController = {
  createUser,
  getProfile,
};
