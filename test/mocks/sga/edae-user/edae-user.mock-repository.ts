import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';

export class EdaeUserMockRepository implements EdaeUserRepository {
  get = jest.fn();
  save = jest.fn();
  update = jest.fn();
  matching = jest.fn();
  count = jest.fn();
}
