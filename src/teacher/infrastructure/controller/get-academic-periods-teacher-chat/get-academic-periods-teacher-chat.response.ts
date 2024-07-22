import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export interface AcademicPeriodTeacherChatResponse {
  id: string;
  name: string;
  code: string;
}

export class GetAcademicPeriodsTeacherChatResponse {
  static create(
    academicPeriods: AcademicPeriod[],
  ): AcademicPeriodTeacherChatResponse[] {
    return academicPeriods.map((period) => ({
      id: period.id,
      name: period.name,
      code: period.code,
    }));
  }
}
