import { EditInternalGroupHandler } from '#student/application/edit-internal-group/edit-internal-group.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { EditInternalGroupCommand } from '#student/application/edit-internal-group/edit-internal-group.command';
import {
  getAPeriodBlock,
  getASubject,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getAnInternalGroup,
} from '#test/entity-factory';
import { getAInternalGroupGetterMock } from '#test/service-factory';
import clearAllMocks = jest.clearAllMocks;
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';

let handler: EditInternalGroupHandler;
let repository: InternalGroupRepository;
let internalGroupGetter: InternalGroupGetter;

let saveSpy: jest.SpyInstance;
let getInternalGroupSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();
const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const periodBlock = getAPeriodBlock();
const subject = getASubject();

const internalGroup = getAnInternalGroup(
  academicPeriod,
  academicProgram,
  periodBlock,
  subject,
);

const command = new EditInternalGroupCommand(
  internalGroup.id,
  'updatedCode',
  true,
  adminUser,
);

describe('Edit Internal Group Handler', () => {
  beforeAll(() => {
    repository = new InternalGroupMockRepository();
    internalGroupGetter = getAInternalGroupGetterMock();
    handler = new EditInternalGroupHandler(repository, internalGroupGetter);

    saveSpy = jest.spyOn(repository, 'save');
    getInternalGroupSpy = jest.spyOn(internalGroupGetter, 'getByAdminUser');
  });

  it('should update an internal group', async () => {
    getInternalGroupSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: internalGroup.id,
        code: 'updatedCode',
        isDefault: true,
      }),
    );
  });

  it('should throw an error if internal group not found', async () => {
    getInternalGroupSpy.mockImplementation(() => {
      throw new InternalGroupNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      InternalGroupNotFoundException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
