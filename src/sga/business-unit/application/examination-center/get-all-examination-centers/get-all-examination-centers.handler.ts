import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { GetAllExaminationCentersQuery } from '#business-unit/application/examination-center/get-all-examination-centers/get-all-examination-centers.query';
import { GetAllExaminationCentersCriteria } from '#business-unit/application/examination-center/get-all-examination-centers/get-all-examination-centers.criteria';

export class GetAllExaminationCentersHandler implements QueryHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async handle(
    query: GetAllExaminationCentersQuery,
  ): Promise<CollectionHandlerResponse<ExaminationCenter>> {
    const criteria = new GetAllExaminationCentersCriteria(query);

    const [total, examinationCenters] = await Promise.all([
      this.examinationCenterRepository.count(criteria, query.businessUnits!),
      this.examinationCenterRepository.matching(criteria, query.businessUnits!),
    ]);

    return {
      total,
      items: examinationCenters,
    };
  }
}
