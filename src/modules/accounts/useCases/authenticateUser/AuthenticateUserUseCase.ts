import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { authConfig } from "../../../../config/authConfig";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUserTokensRepository } from "../../repositories/IUserTokensRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect");
    }

    // generate token
    const token = sign({}, authConfig.secret_token, {
      subject: user.id,
      expiresIn: authConfig.expires_in_token,
    });

    // generate refresh token
    const refresh_token = sign({ email }, authConfig.secret_refresh_token, {
      subject: user.id,
      expiresIn: authConfig.expires_in_refresh_token,
    });

    // insert refresh_token in db
    await this.userTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: this.dateProvider.addSecondsToDate(
        new Date(),
        authConfig.expires_in_refresh_token
      ),
    });

    return {
      user: { name: user.name, email: user.email },
      token,
      refresh_token,
    };
  }
}

export { AuthenticateUserUseCase };
