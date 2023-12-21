import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export abstract class BusinessUnitRepository {
  abstract save(businessUnit: BusinessUnit): Promise<void>;

  abstract get(id: string): Promise<BusinessUnit | null>;

  abstract existsById(id: string): Promise<boolean>;

  abstract existsByName(name: string): Promise<boolean>;

  abstract existsByCode(code: string): Promise<boolean>;

  abstract update(businessUnit: BusinessUnit): Promise<void>;
}
