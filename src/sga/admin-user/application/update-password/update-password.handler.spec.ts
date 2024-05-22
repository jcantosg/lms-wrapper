import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import {
  getAnAdminUser,
  getARecoveryPasswordToken,
} from '#test/entity-factory';
import { RecoveryPasswordTokenMockRepository } from '#test/mocks/sga/adminUser/recovery-password-token.mock-repository';
import {
  getAdminUserGetterMock,
  getAJwtServiceMock,
  getRecoveryPasswordTokenGetterMock,
  PasswordEncoderMock,
} from '#test/service-factory';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { RecoveryPasswordTokenGetter } from '#admin-user/domain/service/recovery-password-token-getter.service';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordHandler } from '#admin-user/application/update-password/update-password.handler';
import { UpdatePasswordCommand } from '#admin-user/application/update-password/update-password.command';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { RecoveryPasswordToken } from '#admin-user/domain/entity/recovery-password-token.entity';

let adminUserGetter: AdminUserGetter;
let adminUserRepository: AdminUserRepository;
let tokenRepository: RecoveryPasswordTokenRepository;
let tokenGetter: RecoveryPasswordTokenGetter;
let jwtService: JwtService;
let handler: UpdatePasswordHandler;

let savePasswordSpy: jest.SpyInstance;
let saveTokenSpy: jest.SpyInstance;

let passwordEncoder: PasswordEncoder;

const command = new UpdatePasswordCommand('password', 'token');

describe('update password handler', () => {
  beforeEach(() => {
    adminUserGetter = getAdminUserGetterMock();
    tokenRepository = new RecoveryPasswordTokenMockRepository();
    adminUserRepository = new AdminUserMockRepository();
    tokenGetter = getRecoveryPasswordTokenGetterMock();
    jwtService = getAJwtServiceMock();
    passwordEncoder = new PasswordEncoderMock();

    savePasswordSpy = jest.spyOn(adminUserRepository, 'save');
    saveTokenSpy = jest.spyOn(tokenRepository, 'save');

    handler = new UpdatePasswordHandler(
      adminUserGetter,
      adminUserRepository,
      tokenRepository,
      tokenGetter,
      jwtService,
      passwordEncoder,
    );
  });

  it('Should update password', async () => {
    const adminUser = getAnAdminUser();
    const recoveryPasswordToken = getARecoveryPasswordToken();
    jest
      .spyOn(adminUserGetter, 'getByEmail')
      .mockImplementation((): Promise<AdminUser> => {
        return Promise.resolve(adminUser);
      });
    jest
      .spyOn(tokenGetter, 'getByToken')
      .mockImplementation((): Promise<RecoveryPasswordToken> => {
        return Promise.resolve(recoveryPasswordToken);
      });
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockImplementation((): Promise<any> => {
        return Promise.resolve({ email: 'email@email.com', id: 'id' });
      });
    jest
      .spyOn(passwordEncoder, 'encodePassword')
      .mockImplementation((): Promise<string> => {
        return Promise.resolve('encoded password');
      });

    await handler.handle(command);

    expect(savePasswordSpy).toHaveBeenCalledTimes(1);
    expect(savePasswordSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'encoded password',
      }),
    );

    expect(saveTokenSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
