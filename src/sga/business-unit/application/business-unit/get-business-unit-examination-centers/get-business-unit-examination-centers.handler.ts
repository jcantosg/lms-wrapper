import { QueryHandler } from '#shared/domain/bus/query.handler';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { GetBusinessUnitExaminationCentersQuery } from '#business-unit/application/business-unit/get-business-unit-examination-centers/get-business-unit-examination-centers.query';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class GetBusinessUnitExaminationCentersHandler implements QueryHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async handle(
    query: GetBusinessUnitExaminationCentersQuery,
  ): Promise<ExaminationCenter[]> {
    if (!query.adminUserBusinessUnits.includes(query.businessUnitId)) {
      throw new BusinessUnitNotFoundException();
    }

    return this.examinationCenterRepository.getByBusinessUnit(
      query.businessUnitId,
    );
  }
}
