import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { GetAllSubjectEdaeUsersQuery } from '#academic-offering/applicaton/subject/get-all-subject-edae-users/get-all-subject-edae-users.query';

export class GetAllSubjectEdaeUsersHandler implements QueryHandler {
  constructor(private readonly subjectGetter: SubjectGetter) {}

  async handle(query: GetAllSubjectEdaeUsersQuery): Promise<EdaeUser[]> {
    const subject = await this.subjectGetter.getByAdminUser(
      query.id,
      query.adminUserBusinessUnits,
      query.isSuperAdmin,
    );

    return subject.teachers;
  }
}
