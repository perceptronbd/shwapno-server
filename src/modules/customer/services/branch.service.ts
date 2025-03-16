import { branchModel } from "../models/branch.model";

const getByName = async (name: string) => {
  return await branchModel.getByName(name);
};

export const branchService = {
  getByName,
};
