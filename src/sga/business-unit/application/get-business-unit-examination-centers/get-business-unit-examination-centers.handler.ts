import { QueryHandler } from '#shared/domain/bus/query.handler';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { GetBusinessUnitExaminationCentersQuery } from '#business-unit/application/get-business-unit-examination-centers/get-business-unit-examination-centers.query';

export class GetBusinessUnitExaminationCentersHandler implements QueryHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async handle(
    query: GetBusinessUnitExaminationCentersQuery,
  ): Promise<ExaminationCenter[]> {
    return this.examinationCenterRepository.getByBusinessUnit(
      query.businessUnitId,
    );
  }
}
