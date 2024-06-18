import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';

export class StudentRefreshTokenMockRepository
  implements StudentRefreshTokenRepository
{
  get = jest.fn();
  save = jest.fn();
  expiresAll = jest.fn();
}
