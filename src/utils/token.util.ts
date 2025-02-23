import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { TPermissions } from "@/modules/auth/types";

type TGenerateTokens = {
  id: string;
  email: string;
  policy: { roles: string[]; permissions: TPermissions[] };
  rememberMe: boolean;
};

export const generateTokens = ({
  id,
  email,
  policy,
  rememberMe,
}: TGenerateTokens) => {
  const accessTokenSecret: Secret = process.env.ACCESS_TOKEN_SECRET!;
  const refreshTokenSecret: Secret = process.env.REFRESH_TOKEN_SECRET!;

  const accessTokenOptions: SignOptions = { expiresIn: "15m" };
  const refreshTokenOptions: SignOptions = {
    expiresIn: rememberMe ? "7d" : ("1d" as const),
  };

  const accessToken = jwt.sign(
    { id, email, policy },
    accessTokenSecret,
    accessTokenOptions,
  );

  const refreshToken = jwt.sign(
    { id, email, policy },
    refreshTokenSecret,
    refreshTokenOptions,
  );

  return { accessToken, refreshToken };
};
