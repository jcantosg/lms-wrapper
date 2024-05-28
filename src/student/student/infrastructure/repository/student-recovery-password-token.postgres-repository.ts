import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { StudentRecoveryPasswordToken } from '#/student/student/domain/entity/student-recovery-password-token.entity';
import { StudentRecoveryPasswordTokenRepository } from '#/student/student/domain/repository/student-recovery-password-token.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { studentRecoveryPasswordTokenSchema } from '#/student/student/infrastructure/config/schema/student-recovery-password-token.schema';
import { Repository } from 'typeorm';
import { getNow } from '#shared/domain/lib/date';

export class StudentRecoveryPasswordTokenPostgresRepository
  extends TypeOrmRepository<StudentRecoveryPasswordToken>
  implements StudentRecoveryPasswordTokenRepository
{
  constructor(
    @InjectRepository(studentRecoveryPasswordTokenSchema)
    private readonly repository: Repository<StudentRecoveryPasswordToken>,
  ) {
    super();
  }

  async expireAllByUser(userId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ expiresAt: getNow() })
      .where('student_id = :userId', { userId })
      .execute();
  }

  async get(id: string): Promise<StudentRecoveryPasswordToken | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async getByToken(
    token: string,
  ): Promise<StudentRecoveryPasswordToken | null> {
    return await this.repository.findOne({ where: { token: token } });
  }

  async getByUser(
    userId: string,
  ): Promise<StudentRecoveryPasswordToken | null> {
    return await this.repository.findOne({
      where: { student: { id: userId } },
    });
  }

  async save(token: StudentRecoveryPasswordToken): Promise<void> {
    await this.repository.save({
      id: token.id,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      token: token.token,
      updatedAt: token.updatedAt,
      student: token.student,
      isRedeemed: token.isRedeemed,
    });
  }
}
