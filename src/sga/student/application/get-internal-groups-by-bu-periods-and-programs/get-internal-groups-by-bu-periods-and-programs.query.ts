import { Query } from '#shared/domain/bus/query';

export class GetInternalGroupsByBuPeriodsAndProgramsQuery implements Query {
  constructor(
    public readonly businessUnitIds: string[],
    public readonly academicPeriodIds: string[],
    public readonly academicProgramIds: string[],
    public readonly adminUserBusinessUnits: string[],
  ) {}
}
