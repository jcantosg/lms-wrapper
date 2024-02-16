import { getAnAdminUser } from '#test/entity-factory';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { GetAllAdminUsersHandler } from '#admin-user/application/get-all-admin-users/get-all-admin-users.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { GetAllAdminUsersQuery } from '#admin-user/application/get-all-admin-users/get-all-admin-users.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';

let handler: GetAllAdminUsersHandler;
let adminUserRepository: AdminUserRepository;
let countAdminUserSpy: any;
let matchingAdminUserSpy: any;
const query = new GetAllAdminUsersQuery(
  [],
  [AdminUserRoles.SUPERADMIN],
  0,
  10,
  'createdAt',
  OrderTypes.DESC,
);

const adminUser = getAnAdminUser();

describe('Get All Admin Users Handler', () => {
  beforeAll(() => {
    adminUserRepository = new AdminUserMockRepository();
    countAdminUserSpy = jest.spyOn(adminUserRepository, 'count');
    matchingAdminUserSpy = jest.spyOn(adminUserRepository, 'matching');
    handler = new GetAllAdminUsersHandler(adminUserRepository);
  });
  it('should return a collection of users', async () => {
    countAdminUserSpy.mockImplementation((): Promise<number> => {
      return Promise.resolve(1);
    });
    matchingAdminUserSpy.mockImplementation((): Promise<AdminUser[]> => {
      return Promise.resolve([adminUser]);
    });
    const result = await handler.handle(query);
    expect(result).toEqual({ total: 1, items: [adminUser] });
  });
});
