import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SearchSubjectsQuery } from '#academic-offering/applicaton/search-subjects/search-subjects.query';
import { SearchSubjectsCriteria } from '#academic-offering/applicaton/search-subjects/search-subjects.criteria';

export class SearchSubjectsHandler implements QueryHandler {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async handle(
    query: SearchSubjectsQuery,
  ): Promise<CollectionHandlerResponse<Subject>> {
    const criteria = new SearchSubjectsCriteria(query);

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
