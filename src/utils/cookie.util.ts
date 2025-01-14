import { Response } from "express";

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    maxAge?: number;
  } = {},
) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict" as "strict" | "lax" | "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  };

  const cookieOptions = { ...defaultOptions, ...options };

  res.cookie(name, value, cookieOptions);
};

export const clearCookieAndHeader = (res: Response) => {
  res.clearCookie("refreshToken");

  res.setHeader("Authorization", "");
};
