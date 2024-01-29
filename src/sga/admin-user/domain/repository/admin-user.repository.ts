import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export abstract class AdminUserRepository {
  abstract save(adminUser: AdminUser): Promise<void>;

  abstract get(id: string): Promise<AdminUser | null>;

  abstract getByEmail(email: string): Promise<AdminUser | null>;

  abstract exists(id: string): Promise<boolean>;

  abstract existsByEmail(email: string): Promise<boolean>;

  /*@TODO refactor to use Criteria */
  abstract getByRole(role: string): Promise<AdminUser[]>;
}
