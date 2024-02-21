import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { GetAllPlainExaminationCentersQuery } from '#business-unit/application/examination-center/get-all-plain-examination-centers/get-all-plain-examination-centers.query';
import { QueryHandler } from '#shared/domain/bus/query.handler';

export class GetAllPlainExaminationCentersHandler implements QueryHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async handle(
    getAllPlainExaminationCentersQuery: GetAllPlainExaminationCentersQuery,
  ) {
    return await this.examinationCenterRepository.getAll(
      getAllPlainExaminationCentersQuery.adminUserBusinessUnits,
      getAllPlainExaminationCentersQuery.isSuperAdmin,
    );
  }
}
