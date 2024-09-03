import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

type AcademicProgramBasicInfo = {
  id: string;
  name: string;
};

export class GetAcademicProgramsByAcademicPeriodPlainResponse {
  static create(academicPeriod: AcademicPeriod): AcademicProgramBasicInfo[] {
    return academicPeriod.academicPrograms
      .filter((ap) => ap.administrativeGroups.length === 0)
      .map((academicProgram) => ({
        id: academicProgram.id,
        name: academicProgram.name,
      }));
  }
}
