import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

export class GetAllAcademicProgramsPlainResponse {
  static create(academicPrograms: AcademicProgram[]) {
    return academicPrograms.map((academicProgram: AcademicProgram) => ({
      id: academicProgram.id,
      name: academicProgram.name,
      code: academicProgram.code,
    }));
  }
}
