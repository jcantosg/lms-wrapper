import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class GetUrlSessionKeyQuery implements Query {
  constructor(public readonly student: Student) {}
}
