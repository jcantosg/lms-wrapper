import { Query } from '#shared/domain/bus/query';

export class GetCommunicationQuery implements Query {
  constructor(public readonly id: string) {}
}
