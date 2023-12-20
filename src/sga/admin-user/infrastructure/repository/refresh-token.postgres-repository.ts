import { RefreshToken } from '#admin-user/domain/entity/refresh-token.entity';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { refreshTokenSchema } from '#admin-user/infrastructure/config/schema/refresh-token.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenPostgresRepository implements RefreshTokenRepository {
  constructor(
    @InjectRepository(refreshTokenSchema)
    private repository: Repository<RefreshToken>,
  ) {}

  async save(token: RefreshToken): Promise<void> {
    token.updated();
    await this.repository.save(token);
  }

  async get(id: string): Promise<RefreshToken | null> {
    return await this.repository.findOneBy({ id });
  }

  async expireAllByUser(userId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ isRevoked: true })
      .where('userId = :userId', { userId })
      .execute();
  }
}
