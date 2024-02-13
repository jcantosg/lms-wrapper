import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';

export abstract class AdminUserRepository {
  abstract save(adminUser: AdminUser): Promise<void>;

  abstract get(id: string): Promise<AdminUser | null>;

  abstract getByEmail(email: string): Promise<AdminUser | null>;

  abstract exists(id: string): Promise<boolean>;

  abstract existsByEmail(email: string): Promise<boolean>;

  abstract matching(criteria: Criteria): Promise<AdminUser[]>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
  ): Promise<AdminUser | null>;
}
