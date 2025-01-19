import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { generateTokens } from "@utils/token.utili";
import { AppError } from "@/types/error.type";
import jwt from "jsonwebtoken";

const login = async () => {};

const resetPassword = async () => {};

const refreshTokens = async (refreshToken: string, rememberMe: boolean) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as jwt.JwtPayload;

    const { id, email, roles } = decoded;

    return generateTokens(id, email, roles, rememberMe);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AppError(
        HTTP_STATUS_CODES.UNAUTHORIZED,
        "Invalid refresh token",
      );
    }
  }
};

export const authService = {
  login,
  resetPassword,
  refreshTokens,
};
