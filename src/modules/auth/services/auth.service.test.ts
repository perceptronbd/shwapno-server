import { validatePassword } from "@/helpers/auth.helper";
import { generateTokens } from "@/utils/token.util";
import { userData } from "@/tests/utils/test-data";
import { authModels } from "../models/auth.model";
import { authService } from "./auth.service";

jest.mock("@/utils/token.util", () => ({
  generateTokens: jest.fn(),
}));
jest.mock("@/helpers/auth.helper", () => ({
  validatePassword: jest.fn(),
}));
jest.mock("../models/auth.model");

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
      (authModels.getUserByEmail as jest.Mock).mockResolvedValue(userData);
      (validatePassword as jest.Mock).mockResolvedValue(true);
      (generateTokens as jest.Mock).mockReturnValue(tokens);

      const result = await authService.login({ email, password, rememberMe });

      expect(authModels.getUserByEmail).toHaveBeenCalledWith(email);
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
          id: userData.id,
          email,
          roles: ["admin"],
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    });

    it("should throw an error if admin is not found", async () => {
      (authModels.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email, password, rememberMe }),
      ).rejects.toThrow();
    });

    it("should throw an error if password is invalid", async () => {
      (authModels.getUserByEmail as jest.Mock).mockResolvedValue(userData);
      (validatePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email, password, rememberMe }),
      ).rejects.toThrow();
    });
  });

  describe("Reset Password Service", () => {
    //write test case for resetPassword where an email is sent to the user with a link to reset password

    it("should reset password", async () => {
      const { email, password } = userData;

      (authModels.getUserByEmail as jest.Mock).mockResolvedValue(userData);
      (authModels.updatePassword as jest.Mock).mockResolvedValue(userData);

      await authService.resetPassword({ email, password });

      expect(authModels.updatePassword).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });
});
