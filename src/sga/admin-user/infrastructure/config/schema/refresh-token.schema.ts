import { RefreshToken } from '#admin-user/domain/entity/refresh-token.entity';
import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';

export const refreshTokenSchema = new EntitySchema<RefreshToken>({
  name: 'RefreshToken',
  tableName: 'refresh_tokens',
  target: RefreshToken,
  columns: {
    ...BaseSchemaColumns,
    isRevoked: {
      type: Boolean,
      nullable: false,
      name: 'is_revoked',
    },
    expiresAt: {
      type: Date,
      nullable: false,
      name: 'expires_at',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'AdminUser',
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'user_id',
      },
    },
  },
});
