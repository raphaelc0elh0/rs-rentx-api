import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../../typeorm/entities/User";

class InMemoryUsersRepository implements IUsersRepository {
  users: User[] = [];

  async create({
    name,
    password,
    email,
    driver_license,
  }: ICreateUserDTO): Promise<void> {
    const user = new User();
    Object.assign(user, { name, password, email, driver_license });
    this.users.push(user);
  }
  async update(user: User): Promise<void> {
    let toBeUpdatedUser = this.users.find((u) => u.id === user.id);
    toBeUpdatedUser = user;
  }
  async findByEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }
  async findById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }
}

export { InMemoryUsersRepository };
