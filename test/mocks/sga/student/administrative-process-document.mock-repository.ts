import { AdministrativeProcessDocument } from '#student/domain/entity/administrative-process-document.entity';
import { AdministrativeProcessDocumentRepository } from '#student/domain/repository/administrative-process-document.repository';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';

export class AdministrativeProcessDocumentMockRepository
  implements AdministrativeProcessDocumentRepository
{
  save = jest.fn();
  get = jest.fn();
  getLastIdentityDocumentsByStudent = jest.fn();
}
