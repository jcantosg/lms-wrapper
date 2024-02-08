import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';

export class GetAllPlainExaminationCentersHandler implements QueryEmptyHandler {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async handle() {
    return await this.examinationCenterRepository.getAll();
  }
}
