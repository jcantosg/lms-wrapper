import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';

export class AdminUserMockRepository implements AdminUserRepository {
  get = jest.fn();
  getByEmail = jest.fn();
  save = jest.fn();
  exists = jest.fn();
  existsByEmail = jest.fn();
  matching = jest.fn();
  count = jest.fn();
  getByAdminUser = jest.fn();
}
