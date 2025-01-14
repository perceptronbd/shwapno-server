import { z } from "zod";

const basic = z.object({
  body: z.object({
    name: z
      .string()
      .min(4, { message: "Name must be at least 4 characters long" })
      .nonempty({ message: "Name is required" }),
    category: z.string().nonempty({ message: "Category is required" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .nonempty({ message: "Email is required" }),
    ownerName: z.string().nonempty({ message: "Owner name is required" }),
    ownerPhone: z
      .string()
      .min(10, { message: "Phone number must be exactly 11 characters long" })
      .max(10, { message: "Phone number must be exactly 11 characters long" })
      .nonempty({ message: "Phone is required" }),
    acronym: z
      .string()
      .min(3, { message: "Acronym must be at least 3 characters long" })
      .nonempty({ message: "Acronym is required" }),
  }),
});

const location = z.object({
  body: z.object({
    country: z.string().nonempty({ message: "Country is required" }),
    division: z.string().nonempty({ message: "Division is required" }),
    district: z.string().nonempty({ message: "District is required" }),
    exactLocation: z
      .string()
      .nonempty({ message: "Exact location is required" }),
  }),
  params: z.object({
    restaurantId: z.string().nonempty({ message: "Restaurant ID is required" }),
  }),
});

export const AccountValidate = {
  basic,
  location,
};

export type BasicZodType = z.infer<typeof AccountValidate.basic>["body"];
export type LocationZodType = z.infer<typeof AccountValidate.location>["body"] &
  z.infer<typeof AccountValidate.location>["params"];
