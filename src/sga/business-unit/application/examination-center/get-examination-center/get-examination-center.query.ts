import { Query } from '#shared/domain/bus/query';

export class GetExaminationCenterQuery implements Query {
  constructor(
    public readonly id: string,
    readonly adminUserBusinessUnits: string[],
  ) {}
}
