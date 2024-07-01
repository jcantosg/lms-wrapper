import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { EdaeUserRefreshToken } from '#/teacher/domain/entity/edae-user-refresh-token.entity';

export const edaeUserRefreshTokenSchema =
  new EntitySchema<EdaeUserRefreshToken>({
    name: 'EdaeUserRefreshToken',
    tableName: 'edae_user_refresh_tokens',
    target: EdaeUserRefreshToken,
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
        target: 'EdaeUser',
        onDelete: 'CASCADE',
        joinColumn: {
          name: 'user_id',
        },
      },
    },
  });
