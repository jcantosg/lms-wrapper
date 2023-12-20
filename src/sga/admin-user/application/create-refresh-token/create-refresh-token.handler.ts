import { CreateRefreshTokenCommand } from '#admin-user/application/create-refresh-token/create-refresh-token.command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RefreshToken } from '#admin-user/domain/entity/refresh-token.entity';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CommandHandler } from '#shared/domain/bus/command.handler';

export class CreateRefreshTokenHandler implements CommandHandler {
  constructor(
    private readonly adminUserGetter: AdminUserGetter,
    private readonly codeRepository: RefreshTokenRepository,
  ) {}

  async handle(command: CreateRefreshTokenCommand): Promise<void> {
    const adminUser: AdminUser = await this.adminUserGetter.get(command.userId);

    const refreshToken = RefreshToken.createForUser(
      command.id,
      adminUser,
      command.ttl,
    );

    await this.codeRepository.save(refreshToken);
  }
}
