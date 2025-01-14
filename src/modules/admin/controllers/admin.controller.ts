import { adminService } from "@modules/admin/services/admin.service";
import { clearCookieAndHeader, setCookie } from "@utils/cookie.util";
import { AdminWithTokens } from "@modules/admin/types/admin.type";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
  const admin = req.body;

  const newAdmin = await adminService.create(admin);

  sendResponse(
    res,
    newAdmin,
    HTTP_STATUS_CODES.CREATED,
    "Admin created successfully!",
  );
};

const login = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  const data: AdminWithTokens = await adminService.login(
    email,
    password,
    rememberMe,
  );

  const { refreshToken, ...admin } = data;

  setCookie(res, "refreshToken", refreshToken);

  res.setHeader("Authorization", `Bearer ${data.accessToken}`);

  sendResponse(res, admin, HTTP_STATUS_CODES.OK, "Logged in successfully!");
};

const logout = async (_req: Request, res: Response) => {
  clearCookieAndHeader(res);

  sendResponse(res, null, HTTP_STATUS_CODES.OK, "Logged out successfully!");
};

export const adminController = {
  create,
  login,
  logout,
};
