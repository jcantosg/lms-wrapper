import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { SearchExaminationCentersCriteria } from '#business-unit/application/search-examination-centers/search-examination-centers.criteria';
import { SearchExaminationCentersQuery } from '#business-unit/application/search-examination-centers/search-examination-centers.query';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';

export class SearchExaminationCentersHandler implements QueryHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async handle(
    query: SearchExaminationCentersQuery,
  ): Promise<CollectionHandlerResponse<ExaminationCenter>> {
    const criteria = new SearchExaminationCentersCriteria(query);

    const [total, examinationCenters] = await Promise.all([
      this.examinationCenterRepository.count(criteria),
      this.examinationCenterRepository.matching(criteria),
    ]);

    return {
      total,
      items: examinationCenters,
    };
  }
}
