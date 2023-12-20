import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';

export class RefreshTokenMockRepository implements RefreshTokenRepository {
  get = jest.fn();
  save = jest.fn();
  expireAllByUser = jest.fn();
}
