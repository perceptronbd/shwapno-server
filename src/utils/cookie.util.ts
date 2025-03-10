import { CookieOptions, Response } from "express";

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {},
) => {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain:
      process.env.NODE_ENV === "production"
        ? new URL(process.env.CLIENT_ADMIN_URL || "").hostname
        : undefined,
  };

  const cookieOptions = { ...defaultOptions, ...options };

  res.cookie(name, value, cookieOptions);
};

export const clearCookieAndHeader = (res: Response) => {
  res.clearCookie("refreshToken");

  res.setHeader("Authorization", "");
};
