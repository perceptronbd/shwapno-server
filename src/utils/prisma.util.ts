import { HTTP_STATUS_CODES } from "../utils/http-status-codes";

// Mapping of Prisma error codes to HTTP status codes and user-friendly messages
export const PRISMA_ERROR_MAP = {
  P2002: {
    code: HTTP_STATUS_CODES.CONFLICT,
    message: "The record already exists.",
  },
  P2003: {
    code: HTTP_STATUS_CODES.BAD_REQUEST,
    message: "The referenced record does not exist.",
  },
  P2025: {
    code: HTTP_STATUS_CODES.NOT_FOUND,
    message: "The record you are trying to update or delete does not exist.",
  },
  P2023: {
    code: HTTP_STATUS_CODES.NOT_FOUND,
    message: "The record does not exist.",
  },
} as const;

export type TPrismaErrorCode = keyof typeof PRISMA_ERROR_MAP;

// Default error response for unknown Prisma errors
export const DEFAULT_PRISMA_ERROR = {
  code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  message: "An unexpected database error occurred.",
};
