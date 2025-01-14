import { z } from "zod";

export const PERMISSIONS = {
  ALL: "all",
  VIEW_REPORTS: "view_reports",
} as const;

export const _PermissionEnum = z.nativeEnum(PERMISSIONS);

export type Permission = z.infer<typeof _PermissionEnum>;
