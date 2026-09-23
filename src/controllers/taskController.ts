import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/taskService.ts";

export class TaskController {
  constructor(private taskService: TaskService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.createTask(req.body);
      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, isDone } = req.query as { userId?: number; isDone?: boolean };
      const tasks = await this.taskService.getAllTasks({
        userId,
        isDone,
      });

      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const task = await this.taskService.getTaskById(id);
      return res.json(task);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const updatedTask = await this.taskService.updateTask(id, req.body);
      return res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      await this.taskService.deleteTask(id);
      return res.json({ message: "Task deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
