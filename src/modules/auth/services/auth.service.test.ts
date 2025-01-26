import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { validatePassword } from "@/helpers/auth.helper";
import { generateTokens } from "@/utils/token.util";
import { userData } from "@/tests/utils/test-data";
import { AppError } from "@/types/error.type";
import { authService } from "./auth.service";
import prisma from "@/config/db.config";

jest.mock("@/utils/token.util", () => ({
  generateTokens: jest.fn(),
}));
jest.mock("@/helpers/auth.helper", () => ({
  validatePassword: jest.fn(),
}));
jest.mock("@/config/db.config", () => ({
  user: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Login Service", () => {
    const { email, password } = userData;
    const rememberMe = true;

    it("should return admin with tokens if login is successful", async () => {
      const tokens = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      };
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(userData);
      (validatePassword as jest.Mock).mockResolvedValue(true);
      (generateTokens as jest.Mock).mockReturnValue(tokens);

      const result = await authService.login({ email, password, rememberMe });

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(validatePassword).toHaveBeenCalledWith(
        password,
        userData.password,
      );
      expect(generateTokens).toHaveBeenCalledWith({
        id: userData.id,
        email,
        policy: userData.policy,
        rememberMe,
      });
      expect(result).toEqual({
        user: {
          id: 1,
          email,
          roles: ["admin"],
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    });

    it("should throw an error if admin is not found", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email, password, rememberMe }),
      ).rejects.toThrow(
        new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Admin not found!"),
      );
    });

    it("should throw an error if password is invalid", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(userData);
      (validatePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email, password, rememberMe }),
      ).rejects.toThrow(
        new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid password"),
      );
    });
  });

  describe("Reset Password Service", () => {
    //write test case for resetPassword where an email is sent to the user with a link to reset password

    it("should reset password", async () => {
      const { email, password } = userData;

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(userData);
      (prisma.user.update as jest.Mock).mockResolvedValue(userData);

      await authService.resetPassword({ email, password });

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email },
        data: { password },
      });
    });
  });
});
