import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetAcademicPeriodsTeacherChatQuery implements Query {
  constructor(
    public readonly edaeUser: EdaeUser,
    public readonly businessUnitId: string,
  ) {}
}
