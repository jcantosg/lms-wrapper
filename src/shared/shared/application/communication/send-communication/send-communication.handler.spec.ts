import { CommunicationMockRepository } from '#test/mocks/shared/communication.mock-repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { TitleGetter } from '#academic-offering/domain/service/title/title-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import {
  getBusinessUnitGetterMock,
  getMailerMock,
} from '#test/service-factory';
import {
  getABusinessUnit,
  getACommunication,
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
import { CommunicationNotFoundException } from '#shared/domain/exception/communication/communication.not-found.exception';
import { Message } from '#shared/domain/value-object/message.value-object';
import { SendCommunicationHandler } from '#shared/application/communication/send-communication/send-communication.handler';
import { MailerService } from '@nestjs-modules/mailer';
import { SendCommunicationCommand } from '#shared/application/communication/send-communication/send-communication.command';
import { CommunicationAlreadySentException } from '#shared/domain/exception/communication/communication.already-sent.exception';
import * as showdown from 'showdown';

let handler: SendCommunicationHandler;
let repository: CommunicationMockRepository;
let communicationStudentRepository: CommunicationStudentRepository;
let businessUnitGetter: BusinessUnitGetter;
let academicPeriodGetter: AcademicPeriodGetter;
let titleGetter: TitleGetter;
let academicProgramGetter: AcademicProgramGetter;
let internalGroupGetter: InternalGroupGetter;
let studentGetter: StudentGetter;
const uuidGenerator: UUIDGeneratorService = new UUIDv4GeneratorService();
let mailer: MailerService;

let saveSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getTitleSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getInternalGroupSpy: jest.SpyInstance;
let getStudentSpy: jest.SpyInstance;
let getSpy: jest.SpyInstance;
let sendSpy: jest.SpyInstance;

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
const communication = getACommunication();

const command = new SendCommunicationCommand(
  communication.id,
  [businessUnit.id],
  [academicPeriod.id],
  [title.id],
  [academicProgram.id],
  [internalGroup.id],
  [student.id],
  'subject',
  'short description',
  'body',
  true,
  false,
  adminUser,
);

describe('Send Communication Handler', () => {
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
    mailer = getMailerMock();

    handler = new SendCommunicationHandler(
      repository,
      communicationStudentRepository,
      businessUnitGetter,
      academicPeriodGetter,
      titleGetter,
      academicProgramGetter,
      internalGroupGetter,
      studentGetter,
      uuidGenerator,
      mailer,
      'comunicados@universae.com',
    );

    saveSpy = jest.spyOn(repository, 'save');
    getSpy = jest.spyOn(repository, 'get');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'get');
    getTitleSpy = jest.spyOn(titleGetter, 'get');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'get');
    getInternalGroupSpy = jest.spyOn(internalGroupGetter, 'getWithStudents');
    getStudentSpy = jest.spyOn(studentGetter, 'get');
    sendSpy = jest.spyOn(mailer, 'sendMail');
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

  it('should send a communication', async () => {
    communication.status = CommunicationStatus.DRAFT;
    getSpy.mockResolvedValue(communication);
    getBusinessUnitSpy.mockResolvedValue(businessUnit);
    getAcademicPeriodSpy.mockResolvedValue(academicPeriod);
    getTitleSpy.mockResolvedValue(title);
    getAcademicProgramSpy.mockResolvedValue(academicProgram);
    getInternalGroupSpy.mockResolvedValue(internalGroup);
    getStudentSpy.mockResolvedValue(student);
    sendSpy.mockResolvedValue(null);

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
        _message: new Message({
          subject: command.subject,
          shortDescription: command.shortDescription,
          body: command.body,
        }),
        _publishOnBoard: false,
        _sendByEmail: true,
        _sentAt: expect.any(Date),
        _sentBy: expect.objectContaining({
          _id: expect.any(String),
          _email: expect.any(String),
          _name: expect.any(String),
          _surname: expect.any(String),
          _surname2: expect.any(String),
        }),
        _status: CommunicationStatus.SENT,
      }),
    );
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [student.email, student.universaeEmail],
        template: './communication',
        subject: communication.message?.value.subject,
        context: {
          subject: communication.message?.value.subject,
          shortDescription: communication.message?.value.shortDescription,
          body: new showdown.Converter().makeHtml(
            communication.message?.value.body ?? '',
          ),
        },
        from: 'Universae comunicados@universae.com',
      }),
    );
  });

  afterEach(() => {
    clearAllMocks();
  });
});
