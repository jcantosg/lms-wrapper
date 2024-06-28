import { StudentRecoveryPasswordToken } from '#/student-360/student/domain/entity/student-recovery-password-token.entity';
import { StudentRecoveryPasswordTokenRepository } from '#/student-360/student/domain/repository/student-recovery-password-token.repository';
import { getNow } from '#shared/domain/lib/date';
import { StudentRecoveryPasswordTokenNotFoundException } from '#shared/domain/exception/student-360/student-recovery-password-token-not-found.exception';
import { StudentRecoveryPasswordTokenExpiredException } from '#shared/domain/exception/student-360/student-recovery-pasword-token-expired.exception';

export class StudentRecoveryPasswordTokenGetter {
  constructor(
    private readonly studentRepository: StudentRecoveryPasswordTokenRepository,
  ) {}

  async getByToken(token: string): Promise<StudentRecoveryPasswordToken> {
    const recoveryPasswordToken =
      await this.studentRepository.getByToken(token);
    if (!recoveryPasswordToken) {
      throw new StudentRecoveryPasswordTokenNotFoundException();
    }
    if (recoveryPasswordToken.expiresAt < getNow()) {
      throw new StudentRecoveryPasswordTokenExpiredException();
    }

    return recoveryPasswordToken;
  }
}
