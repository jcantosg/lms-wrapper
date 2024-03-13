import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export abstract class AcademicPeriodRepository {
  abstract existsById(id: string): Promise<boolean>;

  abstract existsByCode(id: string, code: string): Promise<boolean>;

  abstract save(academicPeriod: AcademicPeriod): Promise<void>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<AcademicPeriod[]>;

  abstract count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number>;

  abstract get(id: string): Promise<AcademicPeriod | null>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicPeriod | null>;
}
