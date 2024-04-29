import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

type AcademicPeriodBasicInfo = {
  id: string;
  name: string;
};

export class GetAcademicPeriodsByBusinessUnitResponse {
  static create(academicPeriods: AcademicPeriod[]): AcademicPeriodBasicInfo[] {
    return academicPeriods.map((academicPeriod) => ({
      id: academicPeriod.id,
      name: academicPeriod.name,
    }));
  }
}
