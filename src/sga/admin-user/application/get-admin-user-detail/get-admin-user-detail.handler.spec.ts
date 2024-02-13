import { v4 as uuid } from 'uuid';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { getAnAdminUser } from '#test/entity-factory';
import {
  getAdminUserGetterMock,
  getAnAdminUserRolesCheckerMock,
} from '#test/service-factory';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { GetAdminUserDetailHandler } from '#admin-user/application/get-admin-user-detail/get-admin-user-detail.handler';
import { GetAdminUserDetailQuery } from '#admin-user/application/get-admin-user-detail/get-admin-user-detail.query';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

let adminUserGetter: AdminUserGetter;
let adminUserRolesChecker: AdminUserRolesChecker;
let getUserSpy: any;

const adminUser = getAnAdminUser();
const query = new GetAdminUserDetailQuery(
  uuid(),
  [],
  [AdminUserRoles.SUPERADMIN],
);
let handler: GetAdminUserDetailHandler;

describe('get admin user detail handler', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    adminUserRolesChecker = getAnAdminUserRolesCheckerMock();
    getUserSpy = jest.spyOn(adminUserGetter, 'getByAdminUser');

    handler = new GetAdminUserDetailHandler(
      adminUserGetter,
      adminUserRolesChecker,
    );
  });

  it('should get an admin user detail', async () => {
    getUserSpy.mockImplementation((): Promise<AdminUser> => {
      return Promise.resolve(adminUser);
    });

    const user = await handler.handle(query);
    expect(user).toEqual(adminUser);
  });

  it('should throw an AdminUserNotFoundException', async () => {
    getUserSpy.mockImplementation((): Promise<AdminUser> => {
      throw new AdminUserNotFoundException();
    });
    await expect(async () => {
      await handler.handle(query);
    }).rejects.toThrow(AdminUserNotFoundException);
  });
});
