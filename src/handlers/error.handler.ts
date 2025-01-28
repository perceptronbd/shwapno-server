import {
  DEFAULT_PRISMA_ERROR,
  PRISMA_ERROR_MAP,
  TPrismaErrorCode,
} from "@/utils/prisma.util";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HTTP_STATUS_CODES } from "../utils/http-status-codes";
import { AppError, ErrorResponse } from "../types/error.type";
import { ZodError } from "zod";

export const appError = (error: AppError, response: ErrorResponse) => {
  response.code = error.statusCode;
  response.message = error.message;
  response.details = error.details;
};

export const zodError = (error: ZodError, response: ErrorResponse) => {
  response.code = HTTP_STATUS_CODES.BAD_REQUEST;
  response.message = error.errors.map((err) => ({ message: err.message }));
  response.details = process.env.NODE_ENV === "development" ? error : undefined;
};

export const generalError = (error: Error, response: ErrorResponse) => {
  response.message = error.message;
  response.details =
    process.env.NODE_ENV === "development" ? { stack: error.stack } : undefined;
};

export const prismaError = (
  error: PrismaClientKnownRequestError,
  response: ErrorResponse,
) => {
  // Look up the error code in the mapping or use the default
  const { code, message } =
    PRISMA_ERROR_MAP[error.code as TPrismaErrorCode] || DEFAULT_PRISMA_ERROR;

  // Set the response properties
  response.code = code;
  response.message = message;

  // Add details in development mode
  response.details =
    process.env.NODE_ENV === "development"
      ? { code: error.code, meta: error.meta }
      : undefined;
};

export const errorHandler = {
  appError,
  zodError,
  generalError,
  prismaError,
};
