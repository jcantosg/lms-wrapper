import { CreateProgramBlockHandler } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { CreateProgramBlockCommand } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.command';
import { getAnAcademicProgram, getAnAdminUser } from '#test/entity-factory';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import { getAnAcademicProgramGetterMock } from '#test/service-factory';
import { ProgramBlockDuplicatedException } from '#shared/domain/exception/academic-offering/program-block.duplicated.exception';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';

let handler: CreateProgramBlockHandler;
let programBlockRepository: ProgramBlockRepository;
let academicProgramGetter: AcademicProgramGetter;
let saveProgramBlockSpy: jest.SpyInstance;
let existsByIdSpy: jest.SpyInstance;
let getByAdminUserSpy: jest.SpyInstance;

const academicProgram = getAnAcademicProgram();
const adminUser = getAnAdminUser();

const command = new CreateProgramBlockCommand(
  academicProgram.id,
  ProgramBlockStructureType.CUSTOM,
  ['4d1fd704-c714-4d58-8588-36944969a72c'],
  adminUser,
);

const commandwithDuplicatedBlocks = new CreateProgramBlockCommand(
  academicProgram.id,
  ProgramBlockStructureType.CUSTOM,
  [
    '4d1fd704-c714-4d58-8588-36944969a72c',
    '4d1fd704-c714-4d58-8588-36944969a72c',
  ],
  adminUser,
);

describe('CreateProgramBlockHandler', () => {
  beforeAll(() => {
    programBlockRepository = new ProgramBlockMockRepository();
    academicProgramGetter = getAnAcademicProgramGetterMock();

    handler = new CreateProgramBlockHandler(
      programBlockRepository,
      academicProgramGetter,
    );

    saveProgramBlockSpy = jest.spyOn(programBlockRepository, 'save');
    existsByIdSpy = jest.spyOn(programBlockRepository, 'existsById');
    getByAdminUserSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
  });

  it('should throw an error if the blocks ids is duplicated', async () => {
    getByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    await expect(handler.handle(commandwithDuplicatedBlocks)).rejects.toThrow(
      ProgramBlockDuplicatedException,
    );
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

    await handler.handle(command);
    expect(saveProgramBlockSpy).toHaveBeenCalledTimes(1);
    expect(saveProgramBlockSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: command.blocks[0],
          name: 'Bloque 1',
        }),
      ]),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
