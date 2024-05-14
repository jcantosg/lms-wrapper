import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';

export class EnrollmentPostgresRepository
  extends TypeOrmRepository<Enrollment>
  implements EnrollmentRepository
{
  constructor(
    @InjectRepository(enrollmentSchema)
    private readonly repository: Repository<Enrollment>,
  ) {
    super();
  }

  async save(enrollment: Enrollment): Promise<void> {
    await this.repository.save({
      id: enrollment.id,
      subject: enrollment.subject,
      academicRecord: enrollment.academicRecord,
      visibility: enrollment.visibility,
      type: enrollment.type,
      programBlock: enrollment.programBlock,
      calls: enrollment.calls,
      maxCalls: enrollment.maxCalls,
    });
  }
}
