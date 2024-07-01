import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';

export class EdaeUserRefreshTokenMockRepository
  implements EdaeUserRefreshTokenRepository
{
  get = jest.fn();
  save = jest.fn();
  expiresAll = jest.fn();
}
