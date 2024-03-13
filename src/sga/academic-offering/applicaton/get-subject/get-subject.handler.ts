import { GetSubjectQuery } from '#academic-offering/applicaton/get-subject/get-subject.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { QueryHandler } from '#shared/domain/bus/query.handler';

export class GetSubjectHandler implements QueryHandler {
  constructor(private readonly subjectGetter: SubjectGetter) {}

  async handle(query: GetSubjectQuery): Promise<Subject> {
    return await this.subjectGetter.getByAdminUser(
      query.id,
      query.adminUserBusinessUnits,
      query.isSuperAdmin,
    );
  }
}
