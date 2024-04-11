import { Query } from '#shared/domain/bus/query';

export class GetAcademicProgramQuery implements Query {
  constructor(
    public readonly id: string,
    readonly adminUserBusinessUnits: string[],
    readonly isSuperAdmin: boolean,
  ) {}
}