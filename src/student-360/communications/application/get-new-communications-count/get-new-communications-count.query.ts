import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class GetNewCommunicationsCountQuery implements Query {
  constructor(public readonly student: Student) {}
}
