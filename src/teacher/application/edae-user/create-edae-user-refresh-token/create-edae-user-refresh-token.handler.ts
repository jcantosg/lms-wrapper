import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';
import { CreateEdaeUserRefreshTokenCommand } from '#/teacher/application/edae-user/create-edae-user-refresh-token/create-edae-user-refresh-token.command';
import { EdaeUserRefreshToken } from '#/teacher/domain/entity/edae-user-refresh-token.entity';

export class CreateEdaeUserRefreshTokenHandler implements CommandHandler {
  constructor(
    private readonly edaeUserGetter: EdaeUserGetter,
    private readonly repository: EdaeUserRefreshTokenRepository,
  ) {}

  async handle(command: CreateEdaeUserRefreshTokenCommand): Promise<void> {
    const edaeUser = await this.edaeUserGetter.get(command.userId);

    const refreshToken = EdaeUserRefreshToken.createForUser(
      command.id,
      edaeUser,
      command.ttl,
    );

    await this.repository.save(refreshToken);
  }
}
