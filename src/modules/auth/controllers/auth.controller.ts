import { authService } from "@modules/auth/services/auth.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { setCookie } from "@utils/cookie.util";
import { Request, Response } from "express";

const login = async () => {};

const logout = async () => {};

const resetPassword = async (_req: Request, _res: Response) => {
  console.log("reset password");
  return "reset password";
};

const refreshTokens = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const rememberMe = req.body.rememberMe;

  const tokens = await authService.refreshTokens(refreshToken, rememberMe);

  setCookie(res, "refreshToken", tokens!.refreshToken);

  res.setHeader("Authorization", `Bearer ${tokens!.accessToken}`);

  sendResponse(
    res,
    tokens!.accessToken,
    HTTP_STATUS_CODES.OK,
    "Tokens refreshed successfully!",
  );
};

export const authController = {
  login,
  logout,
  resetPassword,
  refreshTokens,
};
