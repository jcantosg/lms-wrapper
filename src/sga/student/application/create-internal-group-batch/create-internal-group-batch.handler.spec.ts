import { v4 as uuid } from 'uuid';
import {
  getABlockRelation,
  getAPeriodBlock,
  getAProgramBlock,
  getASubject,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getAnInternalGroup,
} from '#test/entity-factory';
import clearAllMocks = jest.clearAllMocks;
import { CreateInternalGroupsBatchHandler } from '#student/application/create-internal-group-batch/create-internal-group-batch.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { CreateInternalGroupsBatchCommand } from '#student/application/create-internal-group-batch/create-internal-group-batch.command';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import {
  getAnAcademicPeriodGetterMock,
  getAnAcademicProgramGetterMock,
} from '#test/service-factory';
import { BlockRelationMockRepository } from '#test/mocks/sga/academic-offering/block-relation.mock-repository';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { UUIDv4GeneratorService } from '#shared/infrastructure/service/uuid-v4.service';

let handler: CreateInternalGroupsBatchHandler;
let repository: InternalGroupRepository;
let academicPeriodGetter: AcademicPeriodGetter;
let academicProgramGetter: AcademicProgramGetter;
let blockRelationRepository: BlockRelationRepository;
let saveSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getBlockRelationSpy: jest.SpyInstance;
let getInternalGroupsByKeysSpy: jest.SpyInstance;
let uuidGenerator: UUIDGeneratorService;

const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const anotherAcademicProgram = getAnAcademicProgram();
const subject = getASubject();
const adminUser = getAnAdminUser();
const programBlock = getAProgramBlock(uuid(), academicProgram);
const periodBlock = getAPeriodBlock(
  new Date(),
  new Date(),
  uuid(),
  academicPeriod,
);
const blockRelation = getABlockRelation(periodBlock, programBlock);

academicProgram.academicPeriods = [academicPeriod];
academicProgram.programBlocks = [programBlock];
programBlock.subjects = [subject];

const command = new CreateInternalGroupsBatchCommand(
  academicPeriod.id,
  'prefix',
  'sufix',
  [academicProgram.id],
  false,
  adminUser,
);

describe('Create Internal Groups Batch Handler Test', () => {
  beforeAll(() => {
    repository = new InternalGroupMockRepository();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    blockRelationRepository = new BlockRelationMockRepository();
    uuidGenerator = new UUIDv4GeneratorService();
    handler = new CreateInternalGroupsBatchHandler(
      repository,
      academicPeriodGetter,
      academicProgramGetter,
      blockRelationRepository,
      uuidGenerator,
    );
    saveSpy = jest.spyOn(repository, 'saveBatch');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
    getBlockRelationSpy = jest.spyOn(
      blockRelationRepository,
      'getByProgramBlock',
    );
    getInternalGroupsByKeysSpy = jest.spyOn(repository, 'getByKeys');
  });

  it('should throw an AcademicPeriodNotFoundException', async () => {
    getAcademicPeriodSpy.mockImplementation(() => {
      throw new AcademicPeriodNotFoundException();
    });
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicPeriodNotFoundException,
    );
  });

  it('should throw an AcademicProgramNotFoundException', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() => {
      throw new AcademicProgramNotFoundException();
    });
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should throw an AcademicPeriodNotFoundException because academicProgran not linked to academicPeriod', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(anotherAcademicProgram),
    );
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicPeriodNotFoundException,
    );
  });

  it('should throw an AcademicProgramNotFoundException because blockRelation not found', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getBlockRelationSpy.mockImplementation(() => Promise.resolve([]));

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should create an internalGroup with code zero', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getBlockRelationSpy.mockImplementation(() =>
      Promise.resolve([blockRelation]),
    );
    getInternalGroupsByKeysSpy.mockImplementation(() => Promise.resolve([]));

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          code: `${command.prefix} ${academicProgram.code} ${subject.code} ${academicPeriod.code} 0 ${command.sufix}`,
        }),
      ]),
    );
  });

  it('should create an internalGroup with code one', async () => {
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getBlockRelationSpy.mockImplementation(() =>
      Promise.resolve([blockRelation]),
    );
    getInternalGroupsByKeysSpy.mockImplementation(() =>
      Promise.resolve([
        getAnInternalGroup(
          academicPeriod,
          academicProgram,
          periodBlock,
          subject,
        ),
      ]),
    );

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          code: `${command.prefix} ${academicProgram.code} ${subject.code} ${academicPeriod.code} 1 ${command.sufix}`,
        }),
      ]),
    );
  });

  afterEach(() => {
    clearAllMocks();
  });
});
