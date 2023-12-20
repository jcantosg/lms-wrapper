import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';
import { compare } from 'bcrypt';

export class BcryptPasswordChecker implements PasswordChecker {
  async checkPassword(
    plainTextPassword: string,
    user: AdminUser,
  ): Promise<boolean> {
    const comparation = await compare(plainTextPassword, user.password);

    return comparation;
  }
}
