import { ExpireRefreshTokenCommand } from '#admin-user/application/delete-refresh-token/expire-refresh-token.command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CommandHandler } from '#shared/domain/bus/command.handler';

export class ExpireRefreshTokenHandler implements CommandHandler {
  constructor(
    private readonly adminUserGetter: AdminUserGetter,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async handle(command: ExpireRefreshTokenCommand): Promise<void> {
    const adminUser: AdminUser = await this.adminUserGetter.get(
      command.adminUserId,
    );

    await this.refreshTokenRepository.expireAllByUser(adminUser.id);
  }
}
