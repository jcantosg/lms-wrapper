import { CommunicationMockRepository } from '#test/mocks/shared/communication.mock-repository';
import { getACommunication } from '#test/entity-factory';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { CommunicationStudentMockRepository } from '#test/mocks/shared/communication-student.mock-repository';
import clearAllMocks = jest.clearAllMocks;
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { CommunicationNotFoundException } from '#shared/domain/exception/communication/communication.not-found.exception';
import { DeleteCommunicationHandler } from '#shared/application/communication/delete-communication/delete-communication.handler';
import { DeleteCommunicationCommand } from '#shared/application/communication/delete-communication/delete-communication.command';
import { CommunicationAlreadySentException } from '#shared/domain/exception/communication/communication.already-sent.exception';

let handler: DeleteCommunicationHandler;
let repository: CommunicationMockRepository;
let communicationStudentRepository: CommunicationStudentRepository;

let deleteSpy: jest.SpyInstance;
let getSpy: jest.SpyInstance;
let deleteStudentsSpy: jest.SpyInstance;

const communication = getACommunication();

const command = new DeleteCommunicationCommand(communication.id);

describe('Delete Communication Handler', () => {
  beforeEach(() => {
    repository = new CommunicationMockRepository();
    communicationStudentRepository = new CommunicationStudentMockRepository();

    handler = new DeleteCommunicationHandler(
      repository,
      communicationStudentRepository,
    );

    getSpy = jest.spyOn(repository, 'get');
    deleteSpy = jest.spyOn(repository, 'delete');
    deleteStudentsSpy = jest.spyOn(
      communicationStudentRepository,
      'deleteByCommunication',
    );
  });

  it('should throw a CommunicationNotFoundException if communication doesnt exist', async () => {
    getSpy.mockResolvedValue(null);

    await expect(handler.handle(command)).rejects.toThrow(
      CommunicationNotFoundException,
    );
  });

  it('should throw a CommunicationAlreadySentException if communication status is sent', async () => {
    communication.status = CommunicationStatus.SENT;
    getSpy.mockResolvedValue(communication);

    await expect(handler.handle(command)).rejects.toThrow(
      CommunicationAlreadySentException,
    );
  });

  it('should delete a communication', async () => {
    communication.status = CommunicationStatus.DRAFT;
    getSpy.mockResolvedValue(communication);

    await handler.handle(command);

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteStudentsSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
