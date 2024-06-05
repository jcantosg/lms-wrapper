import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';

export abstract class BusinessUnitRepository {
  abstract save(businessUnit: BusinessUnit): Promise<void>;

  abstract get(id: string): Promise<BusinessUnit | null>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
  ): Promise<BusinessUnit | null>;

  abstract existsById(id: string): Promise<boolean>;

  abstract existsByName(id: string, name: string): Promise<boolean>;

  abstract existsByCode(id: string, code: string): Promise<boolean>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: string[],
  ): Promise<BusinessUnit[]>;

  abstract count(
    criteria: Criteria,
    adminUserBusinessUnits: string[],
  ): Promise<number>;

  abstract update(businessUnit: BusinessUnit): Promise<void>;

  abstract getAll(
    adminUserBusinessUnits: string[],
    hasAcademicPeriods: boolean,
  ): Promise<BusinessUnit[]>;

  abstract getByName(name: string): Promise<BusinessUnit | null>;
}
