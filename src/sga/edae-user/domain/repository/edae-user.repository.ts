import { EdaeUser } from '../entity/edae-user.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export abstract class EdaeUserRepository {
  abstract save(edaeUser: EdaeUser): Promise<void>;

  abstract get(id: string): Promise<EdaeUser | null>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<EdaeUser[]>;

  abstract count(
    criteria: Criteria,
    adminUserBusiness: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number>;

  abstract update(edaeUser: EdaeUser): Promise<void>;
}
