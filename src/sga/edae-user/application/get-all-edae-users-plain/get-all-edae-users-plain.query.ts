import { Query } from '#shared/domain/bus/query';

export class GetAllEdaeUsersPlainQuery implements Query {
  constructor(
    public readonly businessUnitId: string,
    public readonly adminUserBusinessUnits: string[],
  ) {}
}
