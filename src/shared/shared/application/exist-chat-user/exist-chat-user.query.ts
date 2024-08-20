import { Query } from '#shared/domain/bus/query';

export class ExistChatUserQuery implements Query {
  constructor(public readonly email: string) {}
}
