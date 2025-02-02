import {
  getASGAStudent,
  getAStudentRecoveryPasswordToken,
} from '#test/entity-factory';
import { RecoveryPasswordTokenMockRepository } from '#test/mocks/sga/adminUser/recovery-password-token.mock-repository';
import {
  getAJwtServiceMock,
  getAStudentRecoveryPasswordTokenGetterMock,
  PasswordEncoderMock,
} from '#test/service-factory';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { StudentRecoveryPasswordTokenRepository } from '#/student-360/student/domain/repository/student-recovery-password-token.repository';
import { StudentRecoveryPasswordTokenGetter } from '#/student-360/student/domain/service/student-recovery-password-token-getter.service';
import { UpdateStudentPasswordHandler } from '#/student-360/student/application/update-password/update-password.handler';
import { UpdateStudentPasswordCommand } from '#/student-360/student/application/update-password/update-password.command';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentRecoveryPasswordToken } from '#/student-360/student/domain/entity/student-recovery-password-token.entity';

let studentRepository: StudentRepository;
let tokenRepository: StudentRecoveryPasswordTokenRepository;
let tokenGetter: StudentRecoveryPasswordTokenGetter;
let jwtService: JwtService;
let handler: UpdateStudentPasswordHandler;

let savePasswordSpy: jest.SpyInstance;
let saveTokenSpy: jest.SpyInstance;

let passwordEncoder: PasswordEncoder;

const command = new UpdateStudentPasswordCommand('password', 'token');

describe('update password handler', () => {
  beforeEach(() => {
    tokenRepository = new RecoveryPasswordTokenMockRepository();
    studentRepository = new StudentMockRepository();
    tokenGetter = getAStudentRecoveryPasswordTokenGetterMock();
    jwtService = getAJwtServiceMock();
    passwordEncoder = new PasswordEncoderMock();

    savePasswordSpy = jest.spyOn(studentRepository, 'save');
    saveTokenSpy = jest.spyOn(tokenRepository, 'save');

    handler = new UpdateStudentPasswordHandler(
      studentRepository,
      tokenRepository,
      tokenGetter,
      jwtService,
      passwordEncoder,
    );
  });

  it('Should update password', async () => {
    const student = getASGAStudent();
    const recoveryPasswordToken = getAStudentRecoveryPasswordToken();
    jest
      .spyOn(studentRepository, 'getByPersonalEmail')
      .mockImplementation((): Promise<Student> => {
        return Promise.resolve(student);
      });
    jest
      .spyOn(tokenGetter, 'getByToken')
      .mockImplementation((): Promise<StudentRecoveryPasswordToken> => {
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
