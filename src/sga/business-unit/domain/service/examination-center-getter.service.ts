import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterNotFoundException } from '#shared/domain/exception/business-unit/examination-center-not-found.exception';

export class ExaminationCenterGetter {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async get(id: string): Promise<ExaminationCenter> {
    const result = await this.examinationCenterRepository.get(id);
    if (!result) {
      throw new ExaminationCenterNotFoundException();
    }

    return result;
  }
}
