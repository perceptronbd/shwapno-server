import { z } from "zod";
const idSchema = z.string().min(1, "Session ID is required");
const create = z.object({
  body: z.object({
    customer: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email format"),
      mobile: z.string().min(1, "Mobile is required"), // TODO: Validate number
      address: z.string().min(1, "Address is required"),
    }),
    sessionId: idSchema,
  }),
  params: z.object({
    id: idSchema,
  }),
});

const track = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
});

// export types
export type TCreateOrderRequest = z.infer<typeof create>["body"];

export const validateOrder = {
  create,
  track,
};
