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
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN ?? ".onrender.com",
  };

  const cookieOptions = { ...defaultOptions, ...options };

  res.cookie(name, value, cookieOptions);
};

export const clearCookieAndHeader = (res: Response) => {
  res.clearCookie("refreshToken");

  res.setHeader("Authorization", "");
};
