import {
  TLoginRequest,
  TResetPasswordRequest,
} from "../validators/auth.validate";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { validatePassword } from "@/helpers/auth.helper";
import { generateTokens } from "@/utils/token.util";
import { authModels } from "../models/auth.model";
import { AppError } from "@/types/error.type";
import jwt from "jsonwebtoken";

const login = async ({ email, password, rememberMe }: TLoginRequest) => {
  const user = await authModels.getUserByEmail(email);

  if (!user) {
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid password");
  }

  const isPasswordValid = await validatePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid password");
  }

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    policy: user.policy,
    rememberMe,
  });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      email: user.email,
      roles: user.policy.roles,
    },
  };
};

const resetPassword = async ({ email, password }: TResetPasswordRequest) => {
  // Simulate finding and updating the user in the database
  const user = await authModels.updatePassword({ email, password });
  const { password: _, ...updateUser } = user;
  return updateUser;
};

const refreshTokens = async (refreshToken: string, rememberMe: boolean) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as jwt.JwtPayload;

    const { id, email, roles } = decoded;

    return generateTokens({ id, email, policy: roles, rememberMe });
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
