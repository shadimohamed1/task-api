import { IUserRepository } from "../repositories/userRepository.ts";
import { CreateUserInput, UpdateUserInput } from "../schemas/userSchema.ts";
import { HttpError } from "../errors/httpError.ts";

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async createUser(data: CreateUserInput) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new HttpError(409, "A user with this email already exists");
    }

    return this.userRepo.create(data);
  }

  async getAllUsers() {
    return this.userRepo.findAll();
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  async updateUser(id: number, data: UpdateUserInput) {
    await this.getUserById(id);

    if (data.email) {
      const existing = await this.userRepo.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new HttpError(409, "A user with this email already exists");
      }
    }

    return this.userRepo.update(id, data);
  }

  async deleteUser(id: number) {
    await this.getUserById(id);
    await this.userRepo.delete(id);
  }
}
