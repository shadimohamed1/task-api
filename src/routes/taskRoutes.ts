import { Router } from "express";
import { TaskController } from "../controllers/taskController.ts";
import { taskController as defaultTaskController } from "../container.ts";
import { validateBody, validateQuery } from "../middlewares/validate.ts";
import { createTaskSchema, updateTaskSchema, getTasksQuerySchema } from "../schemas/taskSchema.ts";

export function createTaskRoutes(controller: TaskController = defaultTaskController): Router {
  const router = Router();

  router.route("/")
    .get(validateQuery(getTasksQuerySchema), controller.getAll)
    .post(validateBody(createTaskSchema), controller.create);

  router.route("/:id")
    .get(controller.getById)
    .patch(validateBody(updateTaskSchema), controller.update)
    .delete(controller.delete);

  return router;
}

export default createTaskRoutes();
