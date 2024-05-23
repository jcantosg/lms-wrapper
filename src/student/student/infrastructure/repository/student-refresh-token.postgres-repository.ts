import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { refreshTokenSchema } from '#/student/student/infrastructure/config/schema/refresh-token.schema';
import { StudentRefreshToken } from '#/student/student/domain/entity/refresh-token.entity';

export class StudentRefreshTokenPostgresRepository
  implements StudentRefreshTokenRepository
{
  constructor(
    @InjectRepository(refreshTokenSchema)
    private repository: Repository<StudentRefreshToken>,
  ) {}

  async save(token: StudentRefreshToken): Promise<void> {
    token.updated();
    await this.repository.save(token);
  }

  async get(id: string): Promise<StudentRefreshToken | null> {
    return await this.repository.findOne({ where: { id } });
  }
}
