import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

export class AcademicProgramsByPeriodsResponse {
  static create(programs: AcademicProgram[]) {
    return programs.map((program) => ({
      id: program.id,
      name: program.name,
      code: program.code,
    }));
  }
}
