import { Query } from '#shared/domain/bus/query';

export class GetSubjectQuery implements Query {
  constructor(
    public readonly id: string,
    readonly adminUserBusinessUnits: string[],
    readonly isSuperAdmin: boolean,
  ) {}
}
