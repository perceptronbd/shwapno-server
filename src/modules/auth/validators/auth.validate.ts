import { z } from "zod";

// Define the schema for login
const login = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    rememberMe: z.boolean(),
  }),
});

// Define the for reset password
const resetPassword = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

const logout = {};

export type TLoginRequest = z.infer<typeof login>["body"];
export type TResetPasswordRequest = z.infer<typeof resetPassword>["body"];

export const validateAuth = {
  login,
  resetPassword,
  logout,
};
