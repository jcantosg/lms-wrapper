import { CreateProgramBlockHandler } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { CreateProgramBlockCommand } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.command';
import { getAnAcademicProgram, getAnAdminUser } from '#test/entity-factory';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import { getAnAcademicProgramGetterMock } from '#test/service-factory';
import { ProgramBlockDuplicatedException } from '#shared/domain/exception/academic-offering/program-block.duplicated.exception';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicProgramMockRepository } from '#test/mocks/sga/academic-offering/academic-program.mock-repository';

let handler: CreateProgramBlockHandler;
let programBlockRepository: ProgramBlockRepository;
let academicProgramGetter: AcademicProgramGetter;
let academicProgramRepository: AcademicProgramRepository;
let saveAcademicProgramSpy: jest.SpyInstance;
let saveProgramBlockSpy: jest.SpyInstance;
let existsByIdSpy: jest.SpyInstance;
let getByAdminUserSpy: jest.SpyInstance;

const academicProgram = getAnAcademicProgram();
const adminUser = getAnAdminUser();

const command = new CreateProgramBlockCommand(
  '4d1fd704-c714-4d58-8588-36944969a72c',
  'Bloque 1',
  academicProgram.id,
  adminUser,
);

describe('CreateProgramBlockHandler', () => {
  beforeAll(() => {
    programBlockRepository = new ProgramBlockMockRepository();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    academicProgramRepository = new AcademicProgramMockRepository();

    handler = new CreateProgramBlockHandler(
      programBlockRepository,
      academicProgramGetter,
      academicProgramRepository,
    );

    saveProgramBlockSpy = jest.spyOn(programBlockRepository, 'save');
    saveAcademicProgramSpy = jest.spyOn(academicProgramRepository, 'save');
    existsByIdSpy = jest.spyOn(programBlockRepository, 'existsById');
    getByAdminUserSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
  });

  it('should throw an error if the program block is duplicated in db', async () => {
    getByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    existsByIdSpy.mockImplementation(() => Promise.resolve(true));

    await expect(handler.handle(command)).rejects.toThrow(
      ProgramBlockDuplicatedException,
    );
  });

  it('should save a program block', async () => {
    getByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));

    const previousProgramBlocksNumber = academicProgram.programBlocksNumber;
    const newProgramBlocksNumber = previousProgramBlocksNumber + 1;

    await handler.handle(command);
    expect(previousProgramBlocksNumber).toBeLessThan(newProgramBlocksNumber);
    expect(saveAcademicProgramSpy).toHaveBeenCalledTimes(1);
    expect(saveAcademicProgramSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        programBlocksNumber: newProgramBlocksNumber,
      }),
    );
    expect(saveProgramBlockSpy).toHaveBeenCalledTimes(1);
    expect(saveProgramBlockSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.id,
        name: 'Bloque 1',
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
