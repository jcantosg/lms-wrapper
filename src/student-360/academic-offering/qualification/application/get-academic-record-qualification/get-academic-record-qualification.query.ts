import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class GetAcademicRecordQualificationQuery implements Query {
  constructor(
    public academicRecordId: string,
    public student: Student,
  ) {}
}
