import { authService } from "@modules/auth/services/auth.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { setCookie } from "@utils/cookie.util";
import { Request, Response } from "express";

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const rememberMe = req.body.rememberMe;

  console.log("cookies", req.cookies);

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
  refresh,
};
