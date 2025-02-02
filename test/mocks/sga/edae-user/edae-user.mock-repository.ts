import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';

export class EdaeUserMockRepository implements EdaeUserRepository {
  get = jest.fn();
  save = jest.fn();
  existsById = jest.fn();
  existsByEmail = jest.fn();
  update = jest.fn();
  matching = jest.fn();
  count = jest.fn();
  getByAdminUser = jest.fn();
  getByBusinessUnit = jest.fn();
  getByEmail = jest.fn();
}
