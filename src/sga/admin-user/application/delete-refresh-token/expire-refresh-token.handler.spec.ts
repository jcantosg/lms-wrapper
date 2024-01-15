import { ExpireRefreshTokenCommand } from '#admin-user/application/delete-refresh-token/expire-refresh-token.command';
import { ExpireRefreshTokenHandler } from '#admin-user/application/delete-refresh-token/expire-refresh-token.handler';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { getAnAdminUser } from '#test/entity-factory';
import { RefreshTokenMockRepository } from '#test/mocks/sga/adminUser/refresh-token.mock-repository';
import { getAdminUserGetterMock } from '#test/service-factory';

let adminUserGetter: AdminUserGetter;
let refreshTokenRepository: RefreshTokenRepository;
let handler: ExpireRefreshTokenHandler;

let expireSpy: any;

const command = new ExpireRefreshTokenCommand('adminUserId');

describe('Expire refresh token handler', () => {
  beforeEach(() => {
    adminUserGetter = getAdminUserGetterMock();
    refreshTokenRepository = new RefreshTokenMockRepository();
    expireSpy = jest.spyOn(refreshTokenRepository, 'expireAllByUser');

    handler = new ExpireRefreshTokenHandler(
      adminUserGetter,
      refreshTokenRepository,
    );
  });

  it('Should expire all refresh token', async () => {
    const adminUser = getAnAdminUser('adminUserId');
    jest
      .spyOn(adminUserGetter, 'get')
      .mockImplementation((): Promise<AdminUser> => {
        return Promise.resolve(adminUser);
      });

    await handler.handle(command);

    expect(expireSpy).toHaveBeenCalledTimes(1);
    expect(expireSpy).toHaveBeenCalledWith(adminUser.id);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
