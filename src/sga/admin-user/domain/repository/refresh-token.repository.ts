import { RefreshToken } from '#admin-user/domain/entity/refresh-token.entity';

export abstract class RefreshTokenRepository {
  abstract save(code: RefreshToken): void;
  abstract get(id: string): Promise<RefreshToken | null>;
  abstract expireAllByUser(userId: string): Promise<void>;
}
