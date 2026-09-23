import { Router } from "express";
import { UserController } from "../controllers/userController.ts";
import { userController as defaultUserController } from "../container.ts";
import { validateBody } from "../middlewares/validate.ts";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema.ts";

export function createUserRoutes(controller: UserController = defaultUserController): Router {
  const router = Router();

  router.route("/")
    .get(controller.getAll)
    .post(validateBody(createUserSchema), controller.create);

  router.route("/:id")
    .get(controller.getById)
    .put(validateBody(updateUserSchema), controller.update)
    .delete(controller.delete);

  return router;
}

export default createUserRoutes();
