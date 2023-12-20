import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export abstract class PasswordChecker {
  abstract checkPassword(
    plainTextPassword: string,
    user: AdminUser,
  ): Promise<boolean>;
}
