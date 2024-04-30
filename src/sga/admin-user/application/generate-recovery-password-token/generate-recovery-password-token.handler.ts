import { v4 as uuid } from 'uuid';
import { GenerateRecoveryPasswordTokenCommand } from '#admin-user/application/generate-recovery-password-token/generate-recovery-password-token.command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { JwtTokenGenerator } from '#admin-user/infrastructure/service/jwt-token-generator.service';
import { RecoveryPasswordTokenGeneratedEvent } from '#admin-user/domain/event/recovery-password-token-generated.event';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';

export class GenerateRecoveryPasswordTokenHandler implements CommandHandler {
  constructor(
    private readonly adminUserGetter: AdminUserGetter,
    private readonly recoveryPasswordTokenRepository: RecoveryPasswordTokenRepository,
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly eventDispatcher: EventDispatcher,
    private readonly ttl: number,
  ) {}

  async handle(command: GenerateRecoveryPasswordTokenCommand): Promise<void> {
    const adminUser: AdminUser = await this.adminUserGetter.getByEmail(
      command.email,
    );

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

    await this.recoveryPasswordTokenRepository.save(recoveryPasswordToken);

    await this.eventDispatcher.dispatch(
      new RecoveryPasswordTokenGeneratedEvent(
        adminUser.email,
        adminUser.name,
        token,
      ),
    );
  }
}
