import { CookieOptions, Response } from "express";

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {},
) => {
  const isProduction = process.env.NODE_ENV === "production";

  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction, // Must be true in production for SameSite=None
    sameSite: isProduction ? "none" : "lax", // Critical fix
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: isProduction ? ".onrender.com" : undefined, // Remove domain for localhost
  };

  res.cookie(name, value, { ...defaultOptions, ...options });
};

export const clearCookieAndHeader = (res: Response) => {
  res.clearCookie("refreshToken");

  res.setHeader("Authorization", "");
};
