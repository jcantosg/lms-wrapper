import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';
import { edaeUserRefreshTokenSchema } from '#/teacher/infrastructure/config/schema/edae-user-refresh-token.schema';
import { EdaeUserRefreshToken } from '#/teacher/domain/entity/edae-user-refresh-token.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export class EdaeUserRefreshTokenPostgresRepository
  implements EdaeUserRefreshTokenRepository
{
  constructor(
    @InjectRepository(edaeUserRefreshTokenSchema)
    private repository: Repository<EdaeUserRefreshToken>,
  ) {}

  async save(token: EdaeUserRefreshToken): Promise<void> {
    token.updated();
    await this.repository.save(token);
  }

  async get(id: string): Promise<EdaeUserRefreshToken | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async expiresAll(edaeUser: EdaeUser): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ isRevoked: true })
      .where('user_id = :userId', { userId: edaeUser.id })
      .execute();
  }
}
