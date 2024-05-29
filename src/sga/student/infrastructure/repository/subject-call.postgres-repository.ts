import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';

export class SubjectCallPostgresRepository
  extends TypeOrmRepository<SubjectCall>
  implements SubjectCallRepository
{
  constructor(
    @InjectRepository(subjectCallSchema)
    private readonly repository: Repository<SubjectCall>,
  ) {
    super();
  }

  async save(subjectCall: SubjectCall): Promise<void> {
    await this.repository.save({
      id: subjectCall.id,
      enrollment: subjectCall.enrollment,
      callNumber: subjectCall.callNumber,
      finalGrade: subjectCall.finalGrade,
      status: subjectCall.status,
    });
  }

  async delete(subjectCall: SubjectCall): Promise<void> {
    await this.repository.delete(subjectCall.id);
  }
}
