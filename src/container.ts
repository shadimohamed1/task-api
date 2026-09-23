import prisma from "./db.ts";
import { UserRepository } from "./repositories/userRepository.ts";
import { TaskRepository } from "./repositories/taskRepository.ts";
import { UserService } from "./services/userService.ts";
import { TaskService } from "./services/taskService.ts";
import { UserController } from "./controllers/userController.ts";
import { TaskController } from "./controllers/taskController.ts";

export const userRepository = new UserRepository(prisma);
export const taskRepository = new TaskRepository(prisma);

export const userService = new UserService(userRepository);
export const taskService = new TaskService(taskRepository, userRepository);

export const userController = new UserController(userService);
export const taskController = new TaskController(taskService);
