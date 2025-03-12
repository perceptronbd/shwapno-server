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
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie(name, value, { ...defaultOptions, ...options });
};

export const clearCookieAndHeader = (res: Response) => {
  res.clearCookie("refreshToken");

  res.setHeader("Authorization", "");
};
