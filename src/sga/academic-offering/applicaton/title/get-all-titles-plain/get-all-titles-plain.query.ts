import { Query } from '#shared/domain/bus/query';

export class GetAllTitlesPlainQuery implements Query {
  constructor(
    public readonly businessUnitId: string,
    public readonly adminUserBusinessUnits: string[],
  ) {}
}
