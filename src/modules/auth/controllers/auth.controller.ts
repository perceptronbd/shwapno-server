import { clearCookieAndHeader, setCookie } from "@utils/cookie.util";
import { authService } from "@modules/auth/services/auth.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  const { accessToken, refreshToken, user } = await authService.login({
    email,
    password,
    rememberMe,
  });

  setCookie(res, "refreshToken", refreshToken);
  res.setHeader("Authorization", `Bearer ${accessToken}`);
  sendResponse(res, user, HTTP_STATUS_CODES.OK, "Login successful!");
};

const logout = async (_: Request, res: Response) => {
  clearCookieAndHeader(res);
  sendResponse(res, null, HTTP_STATUS_CODES.OK, "Logout successful!");
};

const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Call the service to reset the password
  await authService.resetPassword({ email, password });

  // Send a success response
  sendResponse(
    res,
    null,
    HTTP_STATUS_CODES.OK,
    "Password updated successfully!",
  );
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
