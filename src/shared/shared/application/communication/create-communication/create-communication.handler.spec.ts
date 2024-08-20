import { CreateCommunicationHandler } from '#shared/application/communication/create-communication/create-communication.handler';
import { CreateCommunicationCommand } from '#shared/application/communication/create-communication/create-communication.command';
import { CommunicationMockRepository } from '#test/mocks/shared/communication.mock-repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { CommunicationDuplicatedException } from '#shared/domain/exception/academic-offering/communication-duplicated.exception';
import { getBusinessUnitGetterMock } from '#test/service-factory';
import {
  getABusinessUnit,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getAnInternalGroup,
  getAPeriodBlock,
  getASGAStudent,
  getASubject,
  getATitle,
} from '#test/entity-factory';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-offering/academic-period.mock-repository';
import { TitleMockRepository } from '#test/mocks/sga/academic-offering/title.mock-repository';
import { AcademicProgramMockRepository } from '#test/mocks/sga/academic-offering/academic-program.mock-repository';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { StudentMockRepository } from '#test/mocks/sga/student/student.mock-repository';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { CommunicationStudentMockRepository } from '#test/mocks/shared/communication-student.mock-repository';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import clearAllMocks = jest.clearAllMocks;
import { UUIDv4GeneratorService } from '#shared/infrastructure/service/uuid-v4.service';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';

let handler: CreateCommunicationHandler;
let repository: CommunicationMockRepository;
let communicationStudentRepository: CommunicationStudentRepository;
let businessUnitGetter: BusinessUnitGetter;
let academicPeriodGetter: AcademicPeriodGetter;
let titleGetter: TitleGetter;
let academicProgramGetter: AcademicProgramGetter;
let internalGroupGetter: InternalGroupGetter;
let studentGetter: StudentGetter;
const uuidGenerator: UUIDGeneratorService = new UUIDv4GeneratorService();

let saveSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getTitleSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getInternalGroupSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;
let existsSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const adminUser = getAnAdminUser();
const academicPeriod = getAnAcademicPeriod();
const title = getATitle();
const academicProgram = getAnAcademicProgram();
const internalGroup = getAnInternalGroup(
  academicPeriod,
  academicProgram,
  getAPeriodBlock(),
  getASubject(),
);
const student = getASGAStudent();

const command = new CreateCommunicationCommand(
  '06c094cb-c24d-4484-9e95-dcf908d73f60',
  [businessUnit.id],
  [academicPeriod.id],
  [title.id],
  [academicProgram.id],
  [internalGroup.id],
  [student.id],
  adminUser,
);

describe('Create Communication Handler', () => {
  beforeEach(() => {
    repository = new CommunicationMockRepository();
    communicationStudentRepository = new CommunicationStudentMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    academicPeriodGetter = new AcademicPeriodGetter(
      new AcademicPeriodMockRepository(),
    );
    titleGetter = new TitleGetter(new TitleMockRepository());
    academicProgramGetter = new AcademicProgramGetter(
      new AcademicProgramMockRepository(),
    );
    internalGroupGetter = new InternalGroupGetter(
      new InternalGroupMockRepository(),
    );
    studentGetter = new StudentGetter(new StudentMockRepository());

    handler = new CreateCommunicationHandler(
      repository,
      communicationStudentRepository,
      businessUnitGetter,
      academicPeriodGetter,
      titleGetter,
      academicProgramGetter,
      internalGroupGetter,
      studentGetter,
      uuidGenerator,
    );

    saveSpy = jest.spyOn(repository, 'save');
    existsSpy = jest.spyOn(repository, 'exists');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'get');
    getTitleSpy = jest.spyOn(titleGetter, 'get');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'get');
    getInternalGroupSpy = jest.spyOn(internalGroupGetter, 'getWithStudents');
    getStudentSpy = jest.spyOn(studentGetter, 'get');
  });

  it('should throw a CommunicationDuplicatedException if communication already exists', async () => {
    existsSpy.mockResolvedValue(true);

    await expect(handler.handle(command)).rejects.toThrow(
      CommunicationDuplicatedException,
    );
  });

  it('should save a new communication', async () => {
    existsSpy.mockResolvedValue(false);
    getBusinessUnitSpy.mockResolvedValue(businessUnit);
    getAcademicPeriodSpy.mockResolvedValue(academicPeriod);
    getTitleSpy.mockResolvedValue(title);
    getAcademicProgramSpy.mockResolvedValue(academicProgram);
    getInternalGroupSpy.mockResolvedValue(internalGroup);
    getStudentSpy.mockResolvedValue(student);

    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _businessUnits: expect.arrayContaining([businessUnit]),
        _academicPeriods: expect.arrayContaining([academicPeriod]),
        _titles: expect.arrayContaining([title]),
        _academicPrograms: expect.arrayContaining([academicProgram]),
        _internalGroups: expect.arrayContaining([internalGroup]),
        _createdBy: expect.objectContaining({
          _id: expect.any(String),
          _email: expect.any(String),
          _name: expect.any(String),
          _surname: expect.any(String),
          _surname2: expect.any(String),
        }),
        _updatedBy: expect.objectContaining({
          _id: expect.any(String),
          _email: expect.any(String),
          _name: expect.any(String),
          _surname: expect.any(String),
          _surname2: expect.any(String),
        }),
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _message: null,
        _publishOnBoard: null,
        _sendByEmail: null,
        _sentAt: null,
        _sentBy: null,
        _status: CommunicationStatus.DRAFT,
      }),
    );
  });

  afterEach(() => {
    clearAllMocks();
  });
});
