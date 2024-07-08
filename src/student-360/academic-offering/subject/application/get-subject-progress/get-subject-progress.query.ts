import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class GetSubjectProgressQuery implements Query {
  constructor(
    public readonly subjectId: string,
    public readonly student: Student,
  ) {}
}
