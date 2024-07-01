import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserPasswordChecker } from '#/teacher/domain/service/edae-user-password-checker.service';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

@Injectable()
export class EdaeUserCredentialsChecker {
  constructor(
    private readonly edaeUserRepository: EdaeUserRepository,
    private readonly passwordChecker: EdaeUserPasswordChecker,
  ) {}

  public async checkCredentials(
    username: string,
    password: string,
  ): Promise<EdaeUser | void> {
    const edaeUser = await this.edaeUserRepository.getByEmail(username);
    if (edaeUser) {
      if (!(await this.passwordChecker.checkPassword(password, edaeUser))) {
        throw new UnauthorizedException();
      }

      return edaeUser;
    }
  }
}
