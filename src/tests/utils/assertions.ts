import { HTTPStatusCode } from "@/utils/http-status-codes";
// import { ClientSession } from "mongoose";
import { Response } from "supertest";

interface ResponseParams {
  response: Partial<Response>;
  success: boolean;
  code: HTTPStatusCode;
  message?: string;
  data?: Record<string, unknown>;
}

const expectResponse = ({
  response,
  success,
  code,
  message,
  data,
}: ResponseParams) => {
  const { status, body } = response;
  const {
    success: resSuccess,
    code: resCode,
    message: resMessage,
    data: resData,
  } = body;

  expect(status).toBe(code);
  expect(resSuccess).toBe(success);
  expect(resCode).toBe(code);

  if (data) {
    expect(resData).toEqual(data);
  }

  if (message) {
    expect(resMessage).toBe(message);
  }
};

// const expectTransactionStarted = (session: ClientSession) => {
//   expect(session.startTransaction).toHaveBeenCalled();
// };

// const expectTransactionAborted = (session: ClientSession) => {
//   expect(session.abortTransaction).toHaveBeenCalled();
// };

// const expectTransactionCommitted = (session: ClientSession) => {
//   expect(session.commitTransaction).toHaveBeenCalled();
// };

// const expectSessionEnded = (session: ClientSession) => {
//   expect(session.endSession).toHaveBeenCalled();
// };

export const assertions = {
  expectResponse,
  // expectTransactionStarted,
  // expectTransactionAborted,
  // expectTransactionCommitted,
  // expectSessionEnded,
};
