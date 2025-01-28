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
export const errorHandler = {
  appError,
  zodError,
  generalError,
}