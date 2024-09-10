import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetUnreadChatsStudentsQuery implements Query {
  constructor(
    public readonly fbChatrommIds: string[],
    public readonly edaeUser: EdaeUser,
  ) {}
}
