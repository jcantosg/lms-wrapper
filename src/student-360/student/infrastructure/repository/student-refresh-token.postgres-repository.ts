import { StudentRefreshTokenRepository } from '#/student-360/student/domain/repository/student-refresh-token.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { refreshTokenSchema } from '#/student-360/student/infrastructure/config/schema/refresh-token.schema';
import { StudentRefreshToken } from '#/student-360/student/domain/entity/refresh-token.entity';
import { Student } from '#shared/domain/entity/student.entity';

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

  async expiresAll(student: Student): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ isRevoked: true })
      .where('user_id = :userId', { userId: student.id })
      .execute();
  }
}
