import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { getAnAdminUser } from '#test/entity-factory';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';

let service: AdminUserGetter;
let adminUserRepository: AdminUserRepository;

let getUserSpy: any;
let getByAdminUserSpy: any;

const user = getAnAdminUser();

describe('Admin User Getter', () => {
  beforeAll(() => {
    adminUserRepository = new AdminUserMockRepository();

    getUserSpy = jest.spyOn(adminUserRepository, 'get');
    getByAdminUserSpy = jest.spyOn(adminUserRepository, 'getByAdminUser');

    service = new AdminUserGetter(adminUserRepository);
  });

  it('Should return an user', async () => {
    getUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });

    const result = await service.get('userId');

    expect(result).toBe(user);
  });

  it('Should throw a AdminUserNotFoundException', async () => {
    getUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(null);
    });

    await expect(service.get('userId')).rejects.toThrow(
      AdminUserNotFoundException,
    );
  });

  it('Should return an user by admin user', async () => {
    getByAdminUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });

    const result = await service.getByAdminUser('userId', ['businessUnit']);

    expect(result).toBe(user);
  });

  it('Should throw a AdminUserNotFoundException by admin user', async () => {
    getByAdminUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(null);
    });

    await expect(
      service.getByAdminUser('userId', ['businessUnit']),
    ).rejects.toThrow(AdminUserNotFoundException);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
