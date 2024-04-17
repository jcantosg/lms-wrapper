import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';

export class RecoveryPasswordTokenMockRepository
  implements RecoveryPasswordTokenRepository
{
  get = jest.fn();
  save = jest.fn();
  expireAllByUser = jest.fn();
  getByToken = jest.fn();
  getByUser = jest.fn();
}
