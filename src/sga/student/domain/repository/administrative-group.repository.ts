import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Student } from '#shared/domain/entity/student.entity';

export abstract class AdministrativeGroupRepository {
  abstract save(administrativeGroup: AdministrativeGroup): Promise<void>;
  abstract saveBatch(
    administrativeGroups: AdministrativeGroup[],
  ): Promise<void>;
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
  ): Promise<AdministrativeGroup[]>;
  abstract getByAdminUser(
    administrativeGroupId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AdministrativeGroup | null>;
  abstract getByAcademicPeriodAndProgramAndBlock(
    academicPeriodId: string,
    academicProgramId: string,
    periodBlockName: string,
  ): Promise<AdministrativeGroup | null>;
  abstract getByAcademicProgram(
    academicProgramId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AdministrativeGroup[]>;
  abstract getByAcademicPeriodAndProgramAndFirstBlock(
    academicPeriodId: string,
    academicProgramId: string,
  ): Promise<AdministrativeGroup | null>;
  abstract moveStudents(
    students: Student[],
    originGroup: AdministrativeGroup,
    destinationGroup: AdministrativeGroup,
  ): Promise<void>;
}
