import { StudentRecoveryPasswordToken } from '#/student-360/student/domain/entity/student-recovery-password-token.entity';

export abstract class StudentRecoveryPasswordTokenRepository {
  abstract save(token: StudentRecoveryPasswordToken): Promise<void>;

  abstract get(id: string): Promise<StudentRecoveryPasswordToken | null>;

  abstract expireAllByUser(userId: string): Promise<void>;

  abstract getByToken(
    token: string,
  ): Promise<StudentRecoveryPasswordToken | null>;

  abstract getByUser(
    userId: string,
  ): Promise<StudentRecoveryPasswordToken | null>;
}
