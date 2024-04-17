import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';

export const recoveryPasswordTokenSchema =
  new EntitySchema<RecoveryPasswordToken>({
    name: 'RecoveryPasswordToken',
    tableName: 'recovery_password_tokens',
    target: RecoveryPasswordToken,
    columns: {
      ...BaseSchemaColumns,
      expiresAt: {
        type: Date,
        nullable: false,
        name: 'expires_at',
      },
      token: {
        type: String,
        nullable: false,
        name: 'token',
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
