import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { GetAllSubjectsQuery } from '#academic-offering/applicaton/get-all-subjects/get-all-subjects.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { GetAllSubjectsCriteria } from '#academic-offering/applicaton/get-all-subjects/get-all-subjects.criteria';

export class GetAllSubjectsHandler implements QueryHandler {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async handle(
    query: GetAllSubjectsQuery,
  ): Promise<CollectionHandlerResponse<Subject>> {
    const criteria = new GetAllSubjectsCriteria(query);

    const [total, subjects] = await Promise.all([
      this.subjectRepository.count(
        criteria,
        query.adminUserBusinessUnits,
        query.isSuperAdmin,
      ),
      this.subjectRepository.matching(
        criteria,
        query.adminUserBusinessUnits,
        query.isSuperAdmin,
      ),
    ]);

    return {
      total,
      items: subjects,
    };
  }
}
