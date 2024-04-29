import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

interface AcademicProgramBasicInfo {
  id: string;
  name: string;
  code: string;
}

export class GetAcademicProgramsPlainByPeriodResponse {
  static create(
    academicPrograms: AcademicProgram[],
  ): AcademicProgramBasicInfo[] {
    return academicPrograms.map((academicProgram) => ({
      id: academicProgram.id,
      name: academicProgram.name,
      code: academicProgram.code,
    }));
  }
}
