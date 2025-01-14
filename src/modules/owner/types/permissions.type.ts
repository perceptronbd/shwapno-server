import { z } from "zod";

export const PERMISSIONS = {
  ALL: "all",
  MANAGE_RESTAURANTS: "manage_restaurants",
  VIEW_REPORTS: "view_reports",
  MANAGE_EMPLOYEES: "manage_employees",
  MANAGE_CARDS: "manage_cards",
} as const;

const _PermissionEnum = z.nativeEnum(PERMISSIONS);

export type Permission = z.infer<typeof _PermissionEnum>;
