import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

type AcademicProgramBasicInfo = {
  id: string;
  name: string;
};

export class GetAcademicProgramsByAcademicPeriodPlainResponse {
  static create(academicPeriod: AcademicPeriod): AcademicProgramBasicInfo[] {
    return academicPeriod.academicPrograms.map((academicProgram) => ({
      id: academicProgram.id,
      name: academicProgram.name,
    }));
  }
}
