import { HTTP_STATUS_CODES } from "../utils/http-status-codes";
import { AuthRequest, AuthUser } from "@/types/auth.types";
import { Response, NextFunction } from "express";
import { AppError } from "../types/error.type";
import jwt from "jsonwebtoken";

export const authenticateJWT = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return next(
      new AppError(
        HTTP_STATUS_CODES.UNAUTHORIZED,
        "Access Denied! No token was provided",
      ),
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    req.user = decoded as AuthUser;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid token!"));
    } else {
      next(error);
    }
  }
};
