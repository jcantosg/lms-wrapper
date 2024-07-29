import { Query } from '#shared/domain/bus/query';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export class GetSubjectsTeacherChatQuery implements Query {
  constructor(
    public readonly edaeUser: EdaeUser,
    public readonly titleId: string,
  ) {}
}
