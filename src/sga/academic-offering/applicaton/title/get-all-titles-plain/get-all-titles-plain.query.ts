import { Query } from '#shared/domain/bus/query';

export class GetAllTitlesPlainQuery implements Query {
  constructor(
    public readonly businessUnitIds: string[],
    public readonly adminUserBusinessUnits: string[],
  ) {}
}
