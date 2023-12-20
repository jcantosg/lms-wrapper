import { CreateRefreshTokenCommand } from '#admin-user/application/create-refresh-token/create-refresh-token.command';
import { CreateRefreshTokenHandler } from '#admin-user/application/create-refresh-token/create-refresh-token.handler';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { getAnAdminUser } from '#test/entity-factory';
import { RefreshTokenMockRepository } from '#test/mocks/sga/adminUser/refresh-token.mock-repository';
import { getAdminUserGetterMock } from '#test/service-factory';

let adminUserGetter: AdminUserGetter;
let codeRepository: RefreshTokenRepository;
let handler: CreateRefreshTokenHandler;

let saveSpy: any;

const command = new CreateRefreshTokenCommand('tokenId', 'adminUserId', 1000);

describe('Create refresh token handler', () => {
  beforeEach(() => {
    adminUserGetter = getAdminUserGetterMock();
    codeRepository = new RefreshTokenMockRepository();
    saveSpy = jest.spyOn(codeRepository, 'save');

    handler = new CreateRefreshTokenHandler(adminUserGetter, codeRepository);
  });

  it('Should create a refresh token', async () => {
    const adminUser = getAnAdminUser();
    jest
      .spyOn(adminUserGetter, 'get')
      .mockImplementation((): Promise<AdminUser> => {
        return Promise.resolve(adminUser);
      });

    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'tokenId',
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
