import { Query } from '#shared/domain/bus/query';

export class GetStudentsByBuPeriodsAndProgramsQuery implements Query {
  constructor(
    public readonly businessUnitIds: string[],
    public readonly academicPeriodIds: string[],
    public readonly academicProgramIds: string[],
    public readonly userBusinessUnits: string[],
  ) {}
}
