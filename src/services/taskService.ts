import { ITaskRepository } from "../repositories/taskRepository.ts";
import { IUserRepository } from "../repositories/userRepository.ts";
import { CreateTaskInput, UpdateTaskInput, TaskFilterQuery } from "../schemas/taskSchema.ts";
import { HttpError } from "../errors/httpError.ts";

export class TaskService {
  constructor(
    private taskRepo: ITaskRepository,
    private userRepo: IUserRepository
  ) {}

  async createTask(data: CreateTaskInput) {
    const user = await this.userRepo.findById(data.userId);
    if (!user) {
      throw new HttpError(404, "User with given userId not found");
    }

    return this.taskRepo.create(data);
  }

  async getAllTasks(filter?: TaskFilterQuery) {
    return this.taskRepo.findAll(filter);
  }

  async getTaskById(id: number) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new HttpError(404, "Task not found");
    }
    return task;
  }

  async updateTask(id: number, data: UpdateTaskInput) {
    await this.getTaskById(id);
    return this.taskRepo.update(id, data);
  }

  async deleteTask(id: number) {
    await this.getTaskById(id);
    await this.taskRepo.delete(id);
  }
}
