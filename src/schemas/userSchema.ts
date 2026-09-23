import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
});

export const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (name or email) must be provided to update",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
