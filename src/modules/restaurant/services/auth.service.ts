import {
  CreatePasswordZodType,
  LoginZodType,
} from "@modules/restaurant/validators/auth.validator";
import { IOwner, OwnerWithTokens } from "@modules/owner/types/owner.type";
import { hashPassword, validatePassword } from "@/helpers/auth.helper";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { Owner } from "../../owner/models/owner.model";
import { generateTokens } from "@utils/token.utili";
import { AppError } from "@/types/error.type";

const createPassword = async (data: CreatePasswordZodType) => {
  const owner = await Owner.findById(data.ownerId);

  if (!owner) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Owner not found!");
  }

  const hashedPassword = await hashPassword(data.password);

  owner.password = hashedPassword;

  await owner.save();
};

const login = async (
  data: LoginZodType,
): Promise<OwnerWithTokens & Partial<IOwner>> => {
  const { email, password, rememberMe } = data;

  const owner = await Owner.findOne({ email });

  if (!owner)
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Owner not found!");

  const isPasswordValid = await validatePassword(password, owner.password);

  if (!isPasswordValid)
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid password");

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(
    owner._id.toString(),
    owner.email,
    owner.roles,
    rememberMe,
  );

  const ownerObject = owner.toObject();

  return {
    ...ownerObject,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  createPassword,
  login,
};
