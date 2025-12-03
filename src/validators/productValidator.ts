import { z } from "zod";

const productSchemaValidator = z.object({
  name: z.string().min(4),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string().min(2),
  stock: z.number().positive().min(1),
});

export const createProductSchema = productSchemaValidator;

export const updatedProductSchema = productSchemaValidator.partial();
