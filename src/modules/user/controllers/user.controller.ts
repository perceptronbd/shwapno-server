import { Request, Response } from "express";

const createUser = async (_req: Request, res: Response) => {
  res.send("Create user");
};

export const userController = {
  createUser,
};
