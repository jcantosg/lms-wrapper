import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { UpdatePasswordCommand } from '#admin-user/application/update-password/update-password.command';
import { RecoveryPasswordTokenGetter } from '#admin-user/domain/service/recovery-password-token-getter.service';
import { JwtService } from '@nestjs/jwt';
import { getNow } from '#shared/domain/lib/date';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';

export class UpdatePasswordHandler implements CommandHandler {
  constructor(
    private readonly adminUserGetter: AdminUserGetter,
    private readonly adminUserRepository: AdminUserRepository,
    private readonly recoveryPasswordTokenRepository: RecoveryPasswordTokenRepository,
    private readonly recoveryPasswordTokenGetter: RecoveryPasswordTokenGetter,
    private readonly jwtService: JwtService,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async handle(command: UpdatePasswordCommand): Promise<void> {
    const recoveryPasswordToken =
      await this.recoveryPasswordTokenGetter.getByToken(command.token);

    const payload = await this.jwtService.verifyAsync(
      recoveryPasswordToken.token,
    );

    const adminUser: AdminUser = await this.adminUserGetter.getByEmail(
      payload.email,
    );

    adminUser.password = await this.passwordEncoder.encodePassword(
      command.newPassword,
    );
    await this.adminUserRepository.save(adminUser);

    recoveryPasswordToken.expiresAt = getNow();
    await this.recoveryPasswordTokenRepository.save(recoveryPasswordToken);
  }
}
