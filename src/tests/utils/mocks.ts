import { Request, Response } from "express";

const createMockReqRes = (
  overrides?: Partial<Request>,
  paramsOverrides?: Partial<Response>,
) => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

  const req: Partial<Request> = {
    body: {},
    params: {},
    ...overrides,
  };

  const res: Partial<Response> = {
    status: mockStatus,
    json: mockJson,
    ...paramsOverrides,
  };

  return { req, res, mockStatus, mockJson };
};

export const mocks = {
  createMockReqRes,
};
