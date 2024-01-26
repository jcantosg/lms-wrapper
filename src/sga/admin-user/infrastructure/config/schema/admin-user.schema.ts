import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export const adminUserSchema = new EntitySchema<AdminUser>({
  name: 'AdminUser',
  target: AdminUser,
  tableName: 'admin_users',
  columns: {
    ...BaseSchemaColumns,
    email: {
      type: String,
      unique: true,
      nullable: false,
    },
    password: {
      type: String,
      nullable: false,
    },
    roles: {
      array: true,
      enum: AdminUserRoles,
      type: String,
    },
    name: {
      type: String,
      nullable: false,
      default: '',
    },
    avatar: {
      type: String,
      nullable: true,
    },
  },
  relations: {
    businessUnits: {
      type: 'many-to-many',
      target: 'BusinessUnit',
      joinTable: {
        name: 'business_unit_admin_user',
        joinColumn: {
          name: 'admin_user_id',
        },
        inverseJoinColumn: {
          name: 'business_unit_id',
        },
      },
    },
  },
});
