import { Query } from '#shared/domain/bus/query';

export class GetBusinessUnitQuery implements Query {
  constructor(
    public readonly id: string,
    public readonly adminUserBusinessUnits: string[],
  ) {}
}
