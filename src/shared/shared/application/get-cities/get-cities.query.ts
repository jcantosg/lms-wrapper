import { Query } from '#shared/domain/bus/query';

export class GetCitiesQuery implements Query {
  constructor(
    public readonly countryId: string,
    public readonly provinceName: string,
  ) {}
}
