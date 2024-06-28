import { StudentRecoveryPasswordTokenGetter } from '#/student-360/student/domain/service/student-recovery-password-token-getter.service';
import { StudentRecoveryPasswordMockRepository } from '#test/mocks/student/student-recovery-password.mock-repository';
import { StudentRecoveryPasswordTokenRepository } from '#/student-360/student/domain/repository/student-recovery-password-token.repository';
import { getAStudentRecoveryPasswordToken } from '#test/entity-factory';
import { StudentRecoveryPasswordTokenNotFoundException } from '#shared/domain/exception/student-360/student-recovery-password-token-not-found.exception';
import { getNow } from '#shared/domain/lib/date';
import { StudentRecoveryPasswordTokenExpiredException } from '#shared/domain/exception/student-360/student-recovery-pasword-token-expired.exception';
import clearAllMocks = jest.clearAllMocks;

let service: StudentRecoveryPasswordTokenGetter;
let repository: StudentRecoveryPasswordTokenRepository;
let getByTokenSpy: jest.SpyInstance;
const recoveryPasswordToken = getAStudentRecoveryPasswordToken();

describe('StudentRecoveryPasswordTokenGetter unit test', () => {
  beforeAll(() => {
    repository = new StudentRecoveryPasswordMockRepository();
    service = new StudentRecoveryPasswordTokenGetter(repository);
    getByTokenSpy = jest.spyOn(repository, 'getByToken');
  });
  it('should return a student recovery password token', async () => {
    getByTokenSpy.mockImplementation(() =>
      Promise.resolve(recoveryPasswordToken),
    );
    const token = await service.getByToken(recoveryPasswordToken.token);
    expect(token).toBe(recoveryPasswordToken);
  });

  it('should throw an StudentRecoveryPasswordTokenNotFoundException', () => {
    getByTokenSpy.mockImplementation(() => Promise.resolve(null));
    expect(service.getByToken(recoveryPasswordToken.token)).rejects.toThrow(
      StudentRecoveryPasswordTokenNotFoundException,
    );
  });
  it('should throw a StudentRecoveryPasswordTokenExpiredException', () => {
    getByTokenSpy.mockImplementation(() => {
      const recoveryPasswordToken = getAStudentRecoveryPasswordToken();
      recoveryPasswordToken.expiresAt.setDate(getNow().getDate() - 1);

      return Promise.resolve(recoveryPasswordToken);
    });
    expect(service.getByToken(recoveryPasswordToken.token)).rejects.toThrow(
      StudentRecoveryPasswordTokenExpiredException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
