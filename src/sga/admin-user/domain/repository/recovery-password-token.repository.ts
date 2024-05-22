import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';

export abstract class RecoveryPasswordTokenRepository {
  abstract save(token: RecoveryPasswordToken): Promise<void>;

  abstract get(id: string): Promise<RecoveryPasswordToken | null>;

  abstract expireAllByUser(userId: string): Promise<void>;

  abstract getByToken(token: string): Promise<RecoveryPasswordToken | null>;

  abstract getByUser(userId: string): Promise<RecoveryPasswordToken | null>;
}
