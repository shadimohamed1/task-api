import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService.ts";

export class UserController {
  constructor(private userService: UserService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await this.userService.getUserById(id);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const updatedUser = await this.userService.updateUser(id, req.body);
      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(rawId, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      await this.userService.deleteUser(id);
      return res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
