import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CredentialsChecker {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly passwordChecker: PasswordChecker,
  ) {}

  public async checkCredentials(
    email: string,
    plainPassword: string,
  ): Promise<AdminUser | void> {
    const adminUser = await this.adminUserRepository.getByEmail(email);

    if (
      email &&
      adminUser &&
      (await this.passwordChecker.checkPassword(plainPassword, adminUser))
    ) {
      return adminUser;
    }
  }
}
