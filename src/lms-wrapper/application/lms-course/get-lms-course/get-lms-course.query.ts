import { Query } from '#shared/domain/bus/query';

export class GetLMSCourseQuery implements Query {
  constructor(
    public readonly id: number,
    public readonly isSpeciality: boolean,
  ) {}
}
