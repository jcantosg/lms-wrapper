import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { recoveryPasswordTokenSchema } from '#admin-user/infrastructure/config/schema/recovery-password-token.schema';
import { getNow } from '#shared/domain/lib/date';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecoveryPasswordTokenPostgresRepository
  implements RecoveryPasswordTokenRepository
{
  constructor(
    @InjectRepository(recoveryPasswordTokenSchema)
    private repository: Repository<RecoveryPasswordToken>,
  ) {}

  async save(token: RecoveryPasswordToken): Promise<void> {
    token.updated();
    await this.repository.save({
      id: token.id,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      token: token.token,
      updatedAt: token.updatedAt,
      user: token.user,
    });
  }

  async get(id: string): Promise<RecoveryPasswordToken | null> {
    return await this.repository.findOneBy({ id });
  }

  async getByToken(token: string): Promise<RecoveryPasswordToken | null> {
    return await this.repository.findOneBy({ token });
  }

  async getByUser(userId: string): Promise<RecoveryPasswordToken | null> {
    return await this.repository.findOneBy({ user: { id: userId } });
  }

  async expireAllByUser(userId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ expiresAt: getNow() })
      .where('user_id = :userId', { userId })
      .execute();
  }
}
