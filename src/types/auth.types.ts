import { TPermissions } from "@/modules/auth/types";
import { Request } from "express";

export interface AuthUser {
  id: string;
  email: string;
  policy: { roles: string[]; permissions: TPermissions[] };
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
