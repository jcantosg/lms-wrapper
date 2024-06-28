import { StudentRecoveryPasswordTokenRepository } from '#/student-360/student/domain/repository/student-recovery-password-token.repository';

export class StudentRecoveryPasswordMockRepository
  implements StudentRecoveryPasswordTokenRepository
{
  expireAllByUser = jest.fn();

  get = jest.fn();

  getByToken = jest.fn();

  getByUser = jest.fn();

  save = jest.fn();
}
