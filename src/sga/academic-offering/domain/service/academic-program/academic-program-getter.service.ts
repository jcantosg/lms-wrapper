import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';

export class AcademicProgramGetter {
  constructor(
    private readonly academicProgramRepository: AcademicProgramRepository,
  ) {}

  async get(id: string): Promise<AcademicProgram> {
    const academicProgram = await this.academicProgramRepository.get(id);

    if (!academicProgram) {
      throw new AcademicProgramNotFoundException();
    }

    return academicProgram;
  }

  async getByCode(code: string): Promise<AcademicProgram> {
    const academicProgram =
      await this.academicProgramRepository.getByCode(code);

    if (!academicProgram) {
      throw new AcademicProgramNotFoundException();
    }

    return academicProgram;
  }

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicProgram> {
    const result = await this.academicProgramRepository.getByAdminUser(
      id,
      adminUserBusinessUnits,
      isSuperAdmin,
    );

    if (!result) {
      throw new AcademicProgramNotFoundException();
    }

    return result;
  }
}
