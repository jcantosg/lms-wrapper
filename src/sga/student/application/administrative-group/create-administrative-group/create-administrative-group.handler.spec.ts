import { CreateAdministrativeGroupHandler } from '#student/application/administrative-group/create-administrative-group/create-administrative-group.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import {
  getABlockRelation,
  getABusinessUnit,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getAPeriodBlock,
  getAProgramBlock,
} from '#test/entity-factory';
import { CreateAdministrativeGroupCommand } from '#student/application/administrative-group/create-administrative-group/create-administrative-group.command';
import { AdministrativeGroupMockRepository } from '#test/mocks/sga/student/administrative-group.mock-repository';
import {
  getAnAcademicPeriodGetterMock,
  getAnAcademicProgramGetterMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { UUIDv4GeneratorService } from '#shared/infrastructure/service/uuid-v4.service';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { AdministrativeGroupDuplicatedCodeException } from '#shared/domain/exception/administrative-group/administrative-group.duplicated-code.exception';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { BlockRelationMockRepository } from '#test/mocks/sga/academic-offering/block-relation.mock-repository';

let handler: CreateAdministrativeGroupHandler;
let repository: AdministrativeGroupRepository;
let blockRelationRepository: BlockRelationRepository;
let businessUnitGetter: BusinessUnitGetter;
let academicPeriodGetter: AcademicPeriodGetter;
let academicProgramGetter: AcademicProgramGetter;

let saveBatchSpy: jest.SpyInstance;
let existsByCodeSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getByProgramBlockAndAcademicPeriodSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const programBlock = getAProgramBlock();
const secondProgramBlock = getAProgramBlock();
const periodBlock = getAPeriodBlock();
const blockRelation = getABlockRelation(periodBlock, programBlock);

const adminUser = getAnAdminUser();

academicProgram.programBlocks = [programBlock, secondProgramBlock];

const command = new CreateAdministrativeGroupCommand(
  [academicProgram.id],
  businessUnit.id,
  academicPeriod.id,
  adminUser,
);

describe('CreateAcademicRecordHandler', () => {
  beforeAll(() => {
    repository = new AdministrativeGroupMockRepository();
    blockRelationRepository = new BlockRelationMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();

    saveBatchSpy = jest.spyOn(repository, 'saveBatch');
    existsByCodeSpy = jest.spyOn(repository, 'existsByCode');
    getByProgramBlockAndAcademicPeriodSpy = jest.spyOn(
      blockRelationRepository,
      'getByProgramBlockAndAcademicPeriod',
    );
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'get');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'get');

    handler = new CreateAdministrativeGroupHandler(
      repository,
      blockRelationRepository,
      businessUnitGetter,
      academicPeriodGetter,
      academicProgramGetter,
      new UUIDv4GeneratorService(),
    );
  });

  it('should throw a 404 academic period not found exception', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicPeriodNotFoundException,
    );
  });

  it('should throw a 404 academic program not found exception', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    academicPeriod.businessUnit = businessUnit;
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should throw an 404 academic period not found exception when academic program not associate with academic period', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    academicPeriod.businessUnit = businessUnit;
    academicProgram.businessUnit = businessUnit;
    await expect(handler.handle(command)).rejects.toThrow(
      AcademicPeriodNotFoundException,
    );
  });

  it('should throw a 409 administrative code duplicated', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    existsByCodeSpy.mockImplementation(() => Promise.resolve(true));
    getByProgramBlockAndAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(blockRelation),
    );

    academicPeriod.businessUnit = businessUnit;
    academicProgram.businessUnit = businessUnit;
    academicPeriod.academicPrograms = [academicProgram];

    await expect(handler.handle(command)).rejects.toThrow(
      AdministrativeGroupDuplicatedCodeException,
    );
  });

  it('should save an administrative group', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    existsByCodeSpy.mockImplementation(() => Promise.resolve(false));
    getByProgramBlockAndAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(blockRelation),
    );

    academicPeriod.businessUnit = businessUnit;
    academicProgram.businessUnit = businessUnit;
    academicPeriod.academicPrograms = [academicProgram];

    await handler.handle(command);
    expect(saveBatchSpy).toHaveBeenCalledTimes(1);
    expect(saveBatchSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          academicPeriod: academicPeriod,
          academicProgram: academicProgram,
          businessUnit: businessUnit,
          code: 'code_code_1',
          createdBy: adminUser,
          updatedBy: adminUser,
        }),
      ]),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
