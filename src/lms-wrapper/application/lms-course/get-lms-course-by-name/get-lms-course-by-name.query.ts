import { Query } from '#shared/domain/bus/query';

export class GetLMSCourseByNameQuery implements Query {
  constructor(
    public readonly name: string,
    public readonly isSpeciality: boolean,
  ) {}
}
