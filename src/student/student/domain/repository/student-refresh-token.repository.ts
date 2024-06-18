import { StudentRefreshToken } from '#/student/student/domain/entity/refresh-token.entity';
import { Student } from '#shared/domain/entity/student.entity';

export abstract class StudentRefreshTokenRepository {
  abstract save(refreshToken: StudentRefreshToken): Promise<void>;

  abstract get(id: string): Promise<StudentRefreshToken | null>;

  abstract expiresAll(student: Student): Promise<void>;
}
