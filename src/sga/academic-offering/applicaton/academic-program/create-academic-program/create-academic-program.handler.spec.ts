import { CreateAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/create-academic-program/create-academic-program.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import {
  getABusinessUnit,
  getAnAdminUser,
  getATitle,
} from '#test/entity-factory';
import { CreateAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/create-academic-program/create-academic-program.command';
import { v4 as uuid } from 'uuid';
import { AcademicProgramMockRepository } from '#test/mocks/sga/academic-offering/academic-program.mock-repository';
import {
  getATitleGetterMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { AcademicProgramDuplicatedCodeException } from '#shared/domain/exception/academic-offering/academic-program.duplicated-code.exception';
import { TitleNotFoundException } from '#shared/domain/exception/academic-offering/title-not-found.exception';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockMockRepository } from '#test/mocks/sga/academic-offering/program-block.mock-repository';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { TransactionalServiceMock } from '#test/mocks/shared/transactional-service-mock';

let handler: CreateAcademicProgramHandler;
let academicProgramRepository: AcademicProgramRepository;
let transactionalService: TransactionalService;
let programBlockRepository: ProgramBlockRepository;
let businessUnitGetter: BusinessUnitGetter;
let titleGetter: TitleGetter;

let saveSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getTitleSpy: jest.SpyInstance;
let existsByIdSpy: jest.SpyInstance;
let existsByCodeSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const title = getATitle();
const command = new CreateAcademicProgramCommand(
  uuid(),
  'test',
  'code',
  title.id,
  businessUnit.id,
  getAnAdminUser(),
  ProgramBlockStructureType.CUSTOM,
  [],
);
describe('Create Academic Program Handler test', () => {
  beforeAll(async () => {
    academicProgramRepository = new AcademicProgramMockRepository();
    programBlockRepository = new ProgramBlockMockRepository();
    transactionalService = new TransactionalServiceMock();
    businessUnitGetter = getBusinessUnitGetterMock();
    titleGetter = getATitleGetterMock();
    handler = new CreateAcademicProgramHandler(
      academicProgramRepository,
      programBlockRepository,
      transactionalService,
      businessUnitGetter,
      titleGetter,
    );
    saveSpy = jest.spyOn(transactionalService, 'execute');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getTitleSpy = jest.spyOn(titleGetter, 'getByAdminUser');
    existsByIdSpy = jest.spyOn(academicProgramRepository, 'existsById');
    existsByCodeSpy = jest.spyOn(academicProgramRepository, 'existsByCode');
  });

  it('should save an academic program', async () => {
    existsByCodeSpy.mockImplementation(() => Promise.resolve(false));
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getTitleSpy.mockImplementation(() => Promise.resolve(title));

    title.businessUnit = businessUnit;
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        academicProgram: expect.objectContaining({
          id: command.id,
          name: command.name,
          code: command.code,
          businessUnit: businessUnit,
          title: title,
        }),
      }),
    );
  });

  it('should throw AcademicProgramDuplicatedCodeException', () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    existsByCodeSpy.mockImplementation(() => Promise.resolve(true));
    expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramDuplicatedCodeException,
    );
  });
  it('should throw a BusinessUnitNotFoundException', () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    existsByCodeSpy.mockImplementation(() => Promise.resolve(false));
    getBusinessUnitSpy.mockImplementation(() => {
      throw new BusinessUnitNotFoundException();
    });

    expect(handler.handle(command)).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });
  it('should throw a TitleNotFoundException', () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    existsByCodeSpy.mockImplementation(() => Promise.resolve(false));
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getTitleSpy.mockImplementation(() => {
      throw new TitleNotFoundException();
    });
    expect(handler.handle(command)).rejects.toThrow(TitleNotFoundException);
  });
});
