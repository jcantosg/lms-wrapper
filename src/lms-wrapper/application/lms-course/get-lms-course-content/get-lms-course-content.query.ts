import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class GetLmsCourseContentQuery implements Query {
  constructor(
    public readonly id: string,
    public readonly resourcesId: number,
    public readonly student: Student,
  ) {}
}
