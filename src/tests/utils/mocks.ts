import { AuthRequest } from "@/types/auth.types";
import { Request, Response } from "express";

const createMockReqRes = (
  requestOverrides: Partial<Request> = {},
  responseOverrides: Partial<Response> = {},
) => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  const mockCookie = jest.fn();
  const mockHeader = jest.fn();

  const req: Partial<Request> = {
    body: {},
    params: {},
    query: {},
    file: undefined,
    user: undefined,
    ...requestOverrides,
  } as AuthRequest;

  // Default mock Response object
  const res: Partial<Response> = {
    status: mockStatus,
    json: mockJson,
    setHeader: mockHeader,
    cookie: mockCookie,
    ...responseOverrides,
  };

  return { req, res, mockStatus, mockJson };
};

export const mocks = {
  createMockReqRes,
};
