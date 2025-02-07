import { TPermissions } from "@/modules/auth/types";
import jwt from "jsonwebtoken";
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
  const expiresIn: string = rememberMe ? "7d" : "1d";

  const accessToken = jwt.sign(
    { id: id, email, policy },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id, email, policy },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn },
  );

  return { accessToken, refreshToken };
};
