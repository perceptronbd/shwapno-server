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

  const formattedErrors = error.errors.map((err) => {
    console.log(err.path[1]);
    return {
      field: err.path[1],
      message:
        err.path.length === 0
          ? "Request body cannot be empty"
          : err.code === "invalid_type" && err.received === "undefined"
            ? `${err.path[1]} is required`
            : err.message,
      code: err.code,
    };
  });

  // Create a combined message from all validation errors
  const errorMessage = formattedErrors.map((err) => err.message).join(", ");

  response.message = `${errorMessage}!`;
  response.details = {
    errors: formattedErrors,
  };

  if (process.env.NODE_ENV === "development") {
    response.details.debug = error;
  }
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
