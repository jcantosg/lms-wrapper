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
  ): Promise<any> {
    const adminUser = await this.adminUserRepository.getByEmail(email);

    if (
      email &&
      adminUser &&
      (await this.passwordChecker.checkPassword(plainPassword, adminUser))
    ) {
      return {
        id: adminUser.id,
        email: adminUser.email,
        roles: adminUser.roles,
        businessUnits: adminUser.businessUnits.map((bu) => bu.id),
      };
    }
  }
}
