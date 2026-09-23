import { PrismaClient, User } from "../generated/prisma/client.ts";
import { CreateUserInput, UpdateUserInput } from "../schemas/userSchema.ts";

export interface IUserRepository {
  create(data: CreateUserInput): Promise<User>;
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, data: UpdateUserInput): Promise<User>;
  delete(id: number): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany({
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: number): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.task.deleteMany({ where: { userId: id } }),
      this.prisma.user.delete({ where: { id } }),
    ]);
  }
}
