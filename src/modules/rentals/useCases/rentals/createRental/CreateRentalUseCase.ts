import { inject, injectable } from "tsyringe";

import { IDateProvider } from "../../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../../shared/errors/AppError";
import { ICarsRepository } from "../../../../cars/repositories/ICarsRepository";
import { Rental } from "../../../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../../../repositories/IRentalsRepository";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const minimumExpectedReturnTimeDiff = 24; // hours

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );
    if (carUnavailable) throw new AppError("Car is unavailable");

    const userAlreadyHasRental =
      await this.rentalsRepository.findOpenRentalByUser(user_id);
    if (userAlreadyHasRental)
      throw new AppError("User already has a rental ongoing");

    const compare = this.dateProvider.compareInHours(
      new Date(),
      expected_return_date
    );
    if (compare < minimumExpectedReturnTimeDiff)
      throw new AppError("Invalid return time");

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    if (rental) {
      await this.carsRepository.changeAvailable(car_id, false);
    }

    return rental;
  }
}

export { CreateRentalUseCase };
