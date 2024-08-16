import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';

export class CommunicationStudentMockRepository
  implements CommunicationStudentRepository
{
  getByCommunication = jest.fn();
  save = jest.fn();
  deleteByCommunication = jest.fn();
}
