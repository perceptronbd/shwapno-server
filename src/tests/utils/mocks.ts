import { AuthRequest } from "@/types/auth.types";
import { Response } from "express";

const createMockReqRes = (
  requestOverrides: Partial<AuthRequest> = {},
  responseOverrides: Partial<Response> = {},
) => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  const mockCookie = jest.fn();
  const mockHeader = jest.fn();

  const req = {
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
