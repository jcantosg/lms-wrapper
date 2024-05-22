import { StudentRefreshToken } from '#/student/student/domain/entity/refresh-token.entity';

export abstract class StudentRefreshTokenRepository {
  abstract save(refreshToken: StudentRefreshToken): Promise<void>;
}
