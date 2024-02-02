import { Query } from '#shared/domain/bus/query';

export class GetCountriesQuery implements Query {
  constructor(public readonly filter?: string) {}
}
