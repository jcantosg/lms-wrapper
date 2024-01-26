import { Query } from '#shared/domain/bus/query';

export class GetBusinessUnitExaminationCentersQuery implements Query {
  constructor(
    public readonly businessUnitId: string,
    readonly adminUserBusinessUnits: string[],
  ) {}
}
