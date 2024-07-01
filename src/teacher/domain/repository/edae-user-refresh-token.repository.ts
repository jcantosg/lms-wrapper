import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserRefreshToken } from '#/teacher/domain/entity/edae-user-refresh-token.entity';

export abstract class EdaeUserRefreshTokenRepository {
  abstract save(refreshToken: EdaeUserRefreshToken): Promise<void>;

  abstract get(id: string): Promise<EdaeUserRefreshToken | null>;

  abstract expiresAll(student: EdaeUser): Promise<void>;
}
