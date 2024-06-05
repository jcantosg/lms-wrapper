import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';

export class AcademicPeriodGetter {
  constructor(
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async get(id: string): Promise<AcademicPeriod> {
    const academicPeriod = await this.academicPeriodRepository.get(id);

    if (!academicPeriod) {
      throw new AcademicPeriodNotFoundException();
    }

    return academicPeriod;
  }

  async getByCode(code: string): Promise<AcademicPeriod> {
    const academicPeriod = await this.academicPeriodRepository.getByCode(code);

    if (!academicPeriod) {
      throw new AcademicPeriodNotFoundException();
    }

    return academicPeriod;
  }

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicPeriod> {
    const result = await this.academicPeriodRepository.getByAdminUser(
      id,
      adminUserBusinessUnits,
      isSuperAdmin,
    );

    if (!result) {
      throw new AcademicPeriodNotFoundException();
    }

    return result;
  }
}
