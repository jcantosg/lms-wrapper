import { AdministrativeProcessDocumentRepository } from '#student/domain/repository/administrative-process-document.repository';

export class AdministrativeProcessDocumentMockRepository
  implements AdministrativeProcessDocumentRepository
{
  save = jest.fn();
  get = jest.fn();
  getLastIdentityDocumentsByStudent = jest.fn();
}
