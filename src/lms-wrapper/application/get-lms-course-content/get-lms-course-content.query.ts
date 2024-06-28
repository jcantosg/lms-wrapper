import { Query } from '#shared/domain/bus/query';

export class GetLmsCourseContentQuery implements Query {
  constructor(
    public readonly id: string,
    public readonly resourcesId: number,
  ) {}
}
