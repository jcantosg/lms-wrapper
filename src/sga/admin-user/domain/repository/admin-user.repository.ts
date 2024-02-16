import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export abstract class AdminUserRepository {
  abstract save(adminUser: AdminUser): Promise<void>;

  abstract get(id: string): Promise<AdminUser | null>;

  abstract getByEmail(email: string): Promise<AdminUser | null>;

  abstract exists(id: string): Promise<boolean>;

  abstract existsByEmail(email: string): Promise<boolean>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits?: BusinessUnit[],
  ): Promise<AdminUser[]>;

  abstract count(
    criteria: Criteria,
    adminUserBusinessUnits?: BusinessUnit[],
  ): Promise<number>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
  ): Promise<AdminUser | null>;
}
