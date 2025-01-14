import { clearCookieAndHeader, setCookie } from "@utils/cookie.util";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { authService } from "../services/auth.service";
import { Request, Response } from "express";

const createPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { ownerId } = req.params;

  await authService.createPassword({ ownerId, password });

  sendResponse(
    res,
    null,
    HTTP_STATUS_CODES.CREATED,
    "Password created successfully",
  );
};

const login = async (req: Request, res: Response) => {
  const loginData = req.body;

  const result = await authService.login(loginData);

  const { password, refreshToken, ...data } = result;

  setCookie(res, "refreshToken", result.refreshToken);

  res.setHeader("Authorization", `Bearer ${result.accessToken}`);

  sendResponse(res, data, HTTP_STATUS_CODES.OK, "Logged in successfully!");
};

const logout = async (_req: Request, res: Response) => {
  clearCookieAndHeader(res);

  sendResponse(res, null, HTTP_STATUS_CODES.OK, "Logged out successfully!");
};

export const authController = {
  createPassword,
  login,
  logout,
};
