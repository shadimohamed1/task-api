import { PrismaClient } from "../generated/prisma/client.ts";
import { CreateTaskInput, UpdateTaskInput, TaskFilterQuery } from "../schemas/taskSchema.ts";

export interface ITaskRepository {
  create(data: CreateTaskInput): Promise<any>;
  findAll(filter?: TaskFilterQuery): Promise<any[]>;
  findById(id: number): Promise<any | null>;
  update(id: number, data: UpdateTaskInput): Promise<any>;
  delete(id: number): Promise<void>;
  deleteByUserId(userId: number): Promise<number>;
}

export class TaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateTaskInput): Promise<any> {
    return this.prisma.task.create({
      data: {
        title: data.title,
        content: data.content,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(filter?: TaskFilterQuery): Promise<any[]> {
    const where: { userId?: number; isDone?: boolean } = {};

    if (filter?.userId !== undefined) {
      where.userId = filter.userId;
    }

    if (filter?.isDone !== undefined) {
      where.isDone = filter.isDone;
    }

    return this.prisma.task.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: number): Promise<any | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateTaskInput): Promise<any> {
    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }

  async deleteByUserId(userId: number): Promise<number> {
    const result = await this.prisma.task.deleteMany({
      where: { userId },
    });
    return result.count;
  }
}
