import { GenerateRecoveryPasswordTokenCommand } from '#admin-user/application/generate-recovery-password-token/generate-recovery-password-token.command';
import { GenerateRecoveryPasswordTokenHandler } from '#admin-user/application/generate-recovery-password-token/generate-recovery-password-token.handler';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { getAnAdminUser } from '#test/entity-factory';
import { RecoveryPasswordTokenMockRepository } from '#test/mocks/sga/adminUser/recovery-password-token.mock-repository';
import {
  getAdminUserGetterMock,
  getAJwtTokenGeneratorMock,
} from '#test/service-factory';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';

let adminUserGetter: AdminUserGetter;
let tokenRepository: RecoveryPasswordTokenRepository;
let jwtTokenGenerator: JwtTokenGenerator;
let handler: GenerateRecoveryPasswordTokenHandler;
let eventDispatcher: EventDispatcher;

let saveSpy: jest.SpyInstance;
let dispatchEventSpy: jest.SpyInstance;

const command = new GenerateRecoveryPasswordTokenCommand('email@email.com');
const token = 'token';

describe('Generate recovery password token handler', () => {
  beforeEach(() => {
    adminUserGetter = getAdminUserGetterMock();
    tokenRepository = new RecoveryPasswordTokenMockRepository();
    eventDispatcher = new EventDispatcherMock();
    jwtTokenGenerator = getAJwtTokenGeneratorMock();
    saveSpy = jest.spyOn(tokenRepository, 'save');
    dispatchEventSpy = jest.spyOn(eventDispatcher, 'dispatch');

    handler = new GenerateRecoveryPasswordTokenHandler(
      adminUserGetter,
      tokenRepository,
      jwtTokenGenerator,
      eventDispatcher,
      99999,
    );
  });

  it('Should create a recovery password token', async () => {
    const adminUser = getAnAdminUser();
    jest
      .spyOn(adminUserGetter, 'getByEmail')
      .mockImplementation((): Promise<AdminUser> => {
        return Promise.resolve(adminUser);
      });
    jest
      .spyOn(jwtTokenGenerator, 'generateToken')
      .mockImplementation((): string => {
        return token;
      });

    await handler.handle(command);

    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        token,
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
