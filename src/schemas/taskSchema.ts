import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  content: z.string().trim().optional(),
  userId: z.number({ message: "userId must be a number" })
    .int("userId must be an integer")
    .positive("userId must be a positive number"),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title must not be empty").max(200).optional(),
  content: z.string().trim().optional(),
  isDone: z.boolean({ message: "isDone must be a boolean" }).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field (title, content, isDone) must be provided to update",
});

export const getTasksQuerySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  isDone: z.enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFilterQuery = z.infer<typeof getTasksQuerySchema>;
