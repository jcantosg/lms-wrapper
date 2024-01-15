import { v4 as uuid } from 'uuid';
import { getAdminUserGetterMock } from '#test/service-factory';
import { getAnAdminUser } from '#test/entity-factory';
import { GetAdminUserHandler } from '#admin-user/application/get-admin-user/get-admin-user.handler';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { GetAdminUserQuery } from '#admin-user/application/get-admin-user/get-admin-user.query';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

let handler: GetAdminUserHandler;
let adminUserGetter: AdminUserGetter;
let getAdminUserSpy: any;
const query = new GetAdminUserQuery(uuid());
const adminUser = getAnAdminUser(query.id);

describe('Get Admin User Handler', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    getAdminUserSpy = jest.spyOn(adminUserGetter, 'get');
    handler = new GetAdminUserHandler(adminUserGetter);
  });
  it('should return a user', async () => {
    getAdminUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(adminUser);
    });
    const adminUserResult = await handler.handle(query);
    expect(adminUserResult).toEqual(adminUser);
  });
  it('should throw a Admin User Not Found', () => {
    getAdminUserSpy.mockImplementation(() => {
      throw new AdminUserNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(AdminUserNotFoundException);
  });
});
