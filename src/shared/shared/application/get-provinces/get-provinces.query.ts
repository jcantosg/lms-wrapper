import { Query } from '#shared/domain/bus/query';

export class GetProvincesQuery implements Query {
  constructor(public readonly countryId: string) {}
}
