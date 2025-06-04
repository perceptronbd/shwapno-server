import { TGetProductByBranch } from "../validators/product.validate";
import { productModel } from "../models/product.model";

const getByBranch = async ({ branchId, page, limit }: TGetProductByBranch) => {
  const result = await productModel.get({ branchId, page, limit });

  return result;
};

export const productService = {
  getByBranch,
};
