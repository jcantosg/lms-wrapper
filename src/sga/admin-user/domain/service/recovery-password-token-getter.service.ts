import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { RecoveryPasswordTokenExpiredException } from '#shared/domain/exception/admin-user/recovery-password-token-expired.exception';
import { RecoveryPasswordTokenNotFoundException } from '#shared/domain/exception/admin-user/recovery-password-token-not-found.exception';
import { getNow } from '#shared/domain/lib/date';

export class RecoveryPasswordTokenGetter {
  constructor(
    private readonly recoveryPasswordTokenRepository: RecoveryPasswordTokenRepository,
  ) {}

  async get(id: string): Promise<RecoveryPasswordToken> {
    const token = await this.recoveryPasswordTokenRepository.get(id);

    if (!token) {
      throw new RecoveryPasswordTokenNotFoundException();
    }

    return token;
  }

  async getByToken(token: string): Promise<RecoveryPasswordToken> {
    const recoveryPasswordToken =
      await this.recoveryPasswordTokenRepository.getByToken(token);

    if (!recoveryPasswordToken) {
      throw new RecoveryPasswordTokenNotFoundException();
    }

    if (recoveryPasswordToken.expiresAt < getNow()) {
      throw new RecoveryPasswordTokenExpiredException();
    }

    return recoveryPasswordToken;
  }
}
