import { z } from "zod";

const userSchemaValidator = z.object({
  email: z.string().includes("@", { message: "El email debe contener @" }),
  password: z.string().min(6),
});

export const createUserSchema = userSchemaValidator;
