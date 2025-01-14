import jwt from "jsonwebtoken";

export const generateTokens = (
  id: string,
  email: string,
  roles: string[],
  rememberMe: boolean = false,
) => {
  const expiresIn: string = rememberMe ? "7d" : "1d";

  const accessToken = jwt.sign(
    { id: id, email, roles },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id, email, roles },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn },
  );

  return { accessToken, refreshToken };
};
