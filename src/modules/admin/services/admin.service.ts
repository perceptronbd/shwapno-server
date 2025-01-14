import { AdminWithTokens, IAdmin } from "@modules/admin/types/admin.type";
import { hashPassword, validatePassword } from "@/helpers/auth.helper";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { Admin } from "@modules/admin/models/admin.model";
import { generateTokens } from "@utils/token.utili";
import { AppError } from "@/types/error.type";

const create = async (admin: IAdmin): Promise<Partial<IAdmin>> => {
  const hashedPassword = await hashPassword(admin.password);

  const newAdmin = await Admin.create({ ...admin, password: hashedPassword });

  const adminObject = newAdmin.toObject() as Partial<IAdmin>;

  delete adminObject.password;

  return adminObject;
};

const login = async (
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<AdminWithTokens> => {
  const admin = await Admin.findOne({
    email,
  });

  if (!admin) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Admin not found!");
  }

  const adminObject = admin.toObject() as Partial<IAdmin>;

  delete adminObject.password;

  const isPasswordValid = await validatePassword(password, admin.password);

  if (!isPasswordValid) {
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid password");
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(
    admin._id.toString(),
    admin.email,
    admin.roles,
    rememberMe,
  );

  return { ...adminObject, accessToken, refreshToken };
};

export const adminService = {
  create,
  login,
};
