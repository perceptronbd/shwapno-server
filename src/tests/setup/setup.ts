import mongoose, { ClientSession } from "mongoose";

export const setupTestSession = () => {
  let session: ClientSession;

  beforeEach(() => {
    session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    } as unknown as ClientSession;
    jest.spyOn(mongoose, "startSession").mockResolvedValue(session);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  return () => session;
};
