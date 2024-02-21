import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterNotFoundException } from '#shared/domain/exception/business-unit/examination-center/examination-center-not-found.exception';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class ExaminationCenterGetter {
  constructor(
    private readonly examinationCenterRepository: ExaminationCenterRepository,
  ) {}

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<ExaminationCenter> {
    const result = await this.examinationCenterRepository.getByAdminUser(
      id,
      adminUserBusinessUnits,
      isSuperAdmin,
    );
    if (!result) {
      throw new ExaminationCenterNotFoundException();
    }
    if (
      result.businessUnits.length > 0 &&
      !result.businessUnits.find((bu) => adminUserBusinessUnits.includes(bu.id))
    ) {
      throw new BusinessUnitNotFoundException();
    }

    return result;
  }

  async get(id: string): Promise<ExaminationCenter> {
    const result = await this.examinationCenterRepository.get(id);
    if (!result) {
      throw new ExaminationCenterNotFoundException();
    }

    return result;
  }
}
