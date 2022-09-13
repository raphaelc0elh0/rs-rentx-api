import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "../../../../dtos/cars/ICreateCarDTO";
import { IFindAvailableDTO } from "../../../../dtos/cars/IFindAvailableDTO";
import { ICarsRepository } from "../../../../repositories/ICarsRepository";
import { Car } from "../../entities/Car";

class PostgresCarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    });

    await this.repository.save(car);

    return car;
  }

  async findAvailable(data: IFindAvailableDTO): Promise<Car[]> {
    const carsQuery = await this.repository
      .createQueryBuilder("c")
      .where("available = :available", { available: true });

    if (data.brand) {
      carsQuery.andWhere("c.brand = :brand", { brand: data.brand });
    }
    if (data.name) {
      carsQuery.andWhere("c.name = :name", { name: data.name });
    }
    if (data.category_id) {
      carsQuery.andWhere("c.category_id = :category_id", {
        category_id: data.category_id,
      });
    }

    const cars = await carsQuery.getMany();
    return cars;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({
      license_plate,
    });

    return car;
  }
}

export { PostgresCarsRepository };
