import { getAnAdministrativeProcess } from '#test/entity-factory';
import { EditAdministrativeProcessHandler } from '#student/application/administrative-process/edit-administrative-process/edit-administrative-process.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { EditAdministrativeProcessCommand } from '#student/application/administrative-process/edit-administrative-process/edit-administrative-process.command';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { AdministrativeProcessMockRepository } from '#test/mocks/sga/student/administrative-process.mock-repository';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessNotFoundException } from '#shared/domain/exception/student-360/administrative-process.not-found.exception';

let handler: EditAdministrativeProcessHandler;
let repository: AdministrativeProcessRepository;

let getSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const adminProcess = getAnAdministrativeProcess();

const command = new EditAdministrativeProcessCommand(
  adminProcess.id,
  AdministrativeProcessStatusEnum.VALIDATED,
);

describe('Edit Administrative Process Handler', () => {
  beforeAll(() => {
    repository = new AdministrativeProcessMockRepository();

    getSpy = jest.spyOn(repository, 'get');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new EditAdministrativeProcessHandler(repository);
  });

  it('should throw an error if the administrative process is not found', async () => {
    getSpy.mockImplementation(
      (): Promise<AdministrativeProcess | null> => Promise.resolve(null),
    );
    await expect(handler.handle(command)).rejects.toThrow(
      AdministrativeProcessNotFoundException,
    );
  });

  it('should update an administrative Process', async () => {
    getSpy.mockImplementation(
      (): Promise<AdministrativeProcess | null> =>
        Promise.resolve(adminProcess),
    );
    adminProcess.status = AdministrativeProcessStatusEnum.VALIDATED;
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(adminProcess);
  });
});
