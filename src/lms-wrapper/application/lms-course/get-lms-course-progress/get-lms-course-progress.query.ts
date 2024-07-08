import { Query } from '#shared/domain/bus/query';

export class GetLmsCourseProgressQuery implements Query {
  constructor(
    public readonly courseId: number,
    public readonly studentId: number,
  ) {}
}
