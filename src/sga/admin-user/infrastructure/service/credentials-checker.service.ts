import { v4 as uuid } from 'uuid';
import {
  AdminUser,
  MAXIMUM_LOGIN_ATTEMPTS,
} from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';
import { Injectable } from '@nestjs/common';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { AdminUserBlockedEvent } from '#admin-user/domain/event/admin-user-blocked.event';
import { MaximumLoginAttemptsException } from '#shared/domain/exception/admin-user/maximum-login-attempts.exception';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';

@Injectable()
export class CredentialsChecker {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly passwordChecker: PasswordChecker,
    private readonly eventDispatcher: EventDispatcher,
    private readonly recoveryPasswordTokenRepository: RecoveryPasswordTokenRepository,
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly ttl: number,
  ) {}

  public async checkCredentials(
    email: string,
    plainPassword: string,
  ): Promise<AdminUser | void> {
    const adminUser = await this.adminUserRepository.getByEmail(email);

    if (adminUser) {
      if (adminUser.isBlocked()) {
        throw new MaximumLoginAttemptsException();
      }
      if (await this.passwordChecker.checkPassword(plainPassword, adminUser)) {
        adminUser.resetLoginAttempts();
        await this.adminUserRepository.save(adminUser);

        return adminUser;
      } else {
        adminUser.addLoginAttempt();
        await this.adminUserRepository.save(adminUser);
        if (adminUser.loginAttempts >= MAXIMUM_LOGIN_ATTEMPTS) {
          const token = this.jwtTokenGenerator.generateToken(
            adminUser.id,
            adminUser.email,
          );

          const recoveryPasswordToken = RecoveryPasswordToken.createForUser(
            uuid(),
            adminUser,
            token,
            this.ttl,
          );

          await this.recoveryPasswordTokenRepository.save(
            recoveryPasswordToken,
          );
          await this.eventDispatcher.dispatch(
            new AdminUserBlockedEvent(adminUser.id, adminUser.email, token),
          );
          throw new MaximumLoginAttemptsException();
        }
      }
    }
  }
}
