import { DeleteProgramBlockHandler } from '#academic-offering/applicaton/program-block/delete-program-block/delete-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import {
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import { DeleteProgramBlockCommand } from '#academic-offering/applicaton/program-block/delete-program-block/delete-program-block.command';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import {
  getAnAcademicProgramGetterMock,
  getAProgramBlockGetterMock,
} from '#test/service-factory';
import { ProgramBlockHasSubjectsException } from '#shared/domain/exception/academic-offering/program-block.has-subjects.exception';
import { AcademicProgramHasRelatedAcademicPeriodException } from '#shared/domain/exception/academic-offering/academic-program.has-related-academic-period.exception';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramMockRepository } from '#test/mocks/sga/academic-offering/academic-program.mock-repository';

let handler: DeleteProgramBlockHandler;
let programBlockRepository: ProgramBlockRepository;
let academicProgramGetter: AcademicProgramGetter;
let academicProgramRepository: AcademicProgramRepository;
let programBlockGetter: ProgramBlockGetter;
let deleteProgramBlockSpy: jest.SpyInstance;
let saveAcademicProgramSpy: jest.SpyInstance;
let getByAdminUserSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();
const academicProgram = getAnAcademicProgram();
const academicPeriod = getAnAcademicPeriod();
const programBlock = getAProgramBlock('86cbb24e-d2bb-42e9-ad3e-18e17349e1f5');
const subject = getASubject();

const command = new DeleteProgramBlockCommand(
  '86cbb24e-d2bb-42e9-ad3e-18e17349e1f5',
  adminUser,
);

describe('DeleteProgramBlockHandler', () => {
  beforeAll(() => {
    programBlockRepository = new ProgramBlockMockRepository();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    programBlockGetter = getAProgramBlockGetterMock();
    academicProgramRepository = new AcademicProgramMockRepository();

    handler = new DeleteProgramBlockHandler(
      programBlockRepository,
      programBlockGetter,
      academicProgramGetter,
      academicProgramRepository,
    );

    deleteProgramBlockSpy = jest.spyOn(programBlockRepository, 'delete');
    getByAdminUserSpy = jest.spyOn(programBlockGetter, 'getByAdminUser');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'get');
    saveAcademicProgramSpy = jest.spyOn(academicProgramRepository, 'save');
  });

  it('should return 409 if the program block does not exist', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(programBlock));

    programBlock.subjects = [subject];

    await expect(handler.handle(command)).rejects.toThrow(
      ProgramBlockHasSubjectsException,
    );
  });

  it('should return 409 if academic program has related academic period', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(programBlock));
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    programBlock.subjects = [];
    academicProgram.academicPeriods = [academicPeriod];

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramHasRelatedAcademicPeriodException,
    );
  });

  it('should delete a program block', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(programBlock));
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    const previousProgramBlocksNumber = academicProgram.programBlocksNumber;
    const newProgramBlocksNumber = previousProgramBlocksNumber;

    programBlock.subjects = [];
    academicProgram.academicPeriods = [];

    await handler.handle(command);

    expect(previousProgramBlocksNumber).toBeGreaterThanOrEqual(
      newProgramBlocksNumber,
    );
    expect(saveAcademicProgramSpy).toHaveBeenCalledTimes(1);
    expect(saveAcademicProgramSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        programBlocksNumber: newProgramBlocksNumber,
      }),
    );

    expect(deleteProgramBlockSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
