import { Query } from '#shared/domain/bus/query';

export class GetAdminUserQuery implements Query {
  constructor(public readonly id: string) {}
}
