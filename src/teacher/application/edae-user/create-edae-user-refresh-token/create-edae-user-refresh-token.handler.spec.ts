import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';
import { CreateEdaeUserRefreshTokenHandler } from '#/teacher/application/edae-user/create-edae-user-refresh-token/create-edae-user-refresh-token.handler';
import { CreateEdaeUserRefreshTokenCommand } from '#/teacher/application/edae-user/create-edae-user-refresh-token/create-edae-user-refresh-token.command';
import { getEdaeUserGetterMock } from '#test/service-factory';
import { EdaeUserRefreshTokenMockRepository } from '#test/mocks/teacher/edae-user-refresh-token.mock-repository';
import { getAnEdaeUser } from '#test/entity-factory';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

let edaeUserGetter: EdaeUserGetter;
let refreshTokenRepository: EdaeUserRefreshTokenRepository;
let handler: CreateEdaeUserRefreshTokenHandler;

let saveSpy: jest.SpyInstance;

const command = new CreateEdaeUserRefreshTokenCommand(
  'tokenId',
  'studentId',
  1000,
);

describe('Create refresh token handler', () => {
  beforeEach(() => {
    edaeUserGetter = getEdaeUserGetterMock();
    refreshTokenRepository = new EdaeUserRefreshTokenMockRepository();
    saveSpy = jest.spyOn(refreshTokenRepository, 'save');

    handler = new CreateEdaeUserRefreshTokenHandler(
      edaeUserGetter,
      refreshTokenRepository,
    );
  });

  it('Should create a refresh token', async () => {
    const edaeUser = getAnEdaeUser();
    jest
      .spyOn(edaeUserGetter, 'get')
      .mockImplementation((): Promise<EdaeUser> => {
        return Promise.resolve(edaeUser);
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
