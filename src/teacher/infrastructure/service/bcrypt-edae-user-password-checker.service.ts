import { compare } from 'bcrypt';
import { EdaeUserPasswordChecker } from '#/teacher/domain/service/edae-user-password-checker.service';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export class BcryptEdaeUserPasswordChecker implements EdaeUserPasswordChecker {
  async checkPassword(
    plainTextPassword: string,
    user: EdaeUser,
  ): Promise<boolean> {
    return await compare(plainTextPassword, user.password!);
  }
}
