import { EntitySchema } from 'typeorm';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { StudentRefreshToken } from '#/student-360/student/domain/entity/refresh-token.entity';

export const refreshTokenSchema = new EntitySchema<StudentRefreshToken>({
  name: 'StudentRefreshToken',
  tableName: 'student_refresh_tokens',
  target: StudentRefreshToken,
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
      target: 'Student',
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'user_id',
      },
    },
  },
});
