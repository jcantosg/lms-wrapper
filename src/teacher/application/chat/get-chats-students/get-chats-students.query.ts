import { Query } from '#shared/domain/bus/query';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export class GetChatsStudentsQuery implements Query {
  constructor(
    public readonly edaeUser: EdaeUser,
    public readonly businessUnitId?: string,
    public readonly academicPeriodId?: string,
    public readonly titleId?: string,
    public readonly subjectId?: string,
  ) {}
}
