import { Query } from '#shared/domain/bus/query';

export class GetStudentAcademicRecordsQuery implements Query {
  constructor(public readonly studentId: string) {}
}
