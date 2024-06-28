import { EntitySchema } from 'typeorm';
import { StudentRecoveryPasswordToken } from '#/student-360/student/domain/entity/student-recovery-password-token.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const studentRecoveryPasswordTokenSchema =
  new EntitySchema<StudentRecoveryPasswordToken>({
    name: 'StudentRecoveryPasswordToken',
    tableName: 'student_recovery_password_token',
    target: StudentRecoveryPasswordToken,
    columns: {
      ...BaseSchemaColumns,
      expiresAt: {
        type: Date,
        name: 'expires_at',
        nullable: false,
      },
      token: {
        type: String,
        nullable: false,
      },
      isRedeemed: {
        type: Boolean,
        nullable: false,
        default: false,
      },
    },
    relations: {
      ...BaseSchemaRelations,
      student: {
        type: 'many-to-one',
        target: 'Student',
        joinColumn: {
          name: 'student_id',
        },
      },
    },
  });
