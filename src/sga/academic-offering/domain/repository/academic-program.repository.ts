import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

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

  abstract count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<AcademicProgram[]>;

  abstract getByAcademicPeriod(
    academicPeriodId: string,
    hasAdministrativeGroup?: boolean,
  ): Promise<AcademicProgram[]>;
}
