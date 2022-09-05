import { getRepository, Repository } from "typeorm";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

class PostgresUsersRepository implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = getRepository(User)
  }

  async create({ name, password, email, driver_license }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name, password, email, driver_license
    })

    await this.repository.save(user)
  }

  async findById(id: string): Promise<User> {
    return await this.repository.findOne(id)
  }

  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email } })
  }
}

export { PostgresUsersRepository }