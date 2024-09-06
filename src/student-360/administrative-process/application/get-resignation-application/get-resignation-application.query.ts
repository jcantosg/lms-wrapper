import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class GetResignationApplicationQuery implements Query {
  constructor(
    public readonly academicRecordId: string,
    public readonly student: Student,
  ) {}
}
