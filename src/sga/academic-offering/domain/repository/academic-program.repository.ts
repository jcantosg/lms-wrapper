import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

export abstract class AcademicProgramRepository {
  abstract save(academicProgram: AcademicProgram): Promise<void>;
  abstract get(id: string): Promise<AcademicProgram | null>;
  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicProgram | null>;
  abstract existsById(id: string): Promise<boolean>;
  abstract existsByCode(id: string, code: string): Promise<boolean>;
}
