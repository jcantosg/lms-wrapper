import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';
import { ExpireEdaeUserRefreshTokenCommand } from '#/teacher/application/edae-user/expire-edae-user-refresh-token/expire-edae-user-refresh-token.command';

export class ExpireEdaeUserRefreshTokenHandler implements CommandHandler {
  constructor(
    private readonly edaeUserGetter: EdaeUserGetter,
    private readonly refreshTokenRepository: EdaeUserRefreshTokenRepository,
  ) {}

  async handle(command: ExpireEdaeUserRefreshTokenCommand): Promise<void> {
    const edaeUser = await this.edaeUserGetter.get(command.edaeUserId);
    await this.refreshTokenRepository.expiresAll(edaeUser);
  }
}
