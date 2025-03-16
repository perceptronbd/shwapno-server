import { branchModel } from "../models/branch.model";

const getById = async (id: string) => {
  return await branchModel.getById(id);
};

export const branchService = {
  getById,
};
