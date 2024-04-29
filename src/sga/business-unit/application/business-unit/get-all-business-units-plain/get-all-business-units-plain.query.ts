import { Query } from '#shared/domain/bus/query';

export class GetAllBusinessUnitsPlainQuery implements Query {
  constructor(
    public readonly adminUserBusinessUnits: string[],
    public readonly hasAcademicPeriods: boolean,
  ) {}
}
