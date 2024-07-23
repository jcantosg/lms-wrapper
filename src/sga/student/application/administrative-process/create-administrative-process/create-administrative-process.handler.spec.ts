import { getAnAcademicRecordGetterMock } from '#test/service-factory';
import {
  getAnAcademicRecord,
  getAnAdministrativeProcessDocument,
  getAnAdminUser,
} from '#test/entity-factory';
import { CreateAdministrativeProcessHandler } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AdministrativeProcessDocumentRepository } from '#student/domain/repository/administrative-process-document.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { CreateAdministrativeProcessCommand } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.command';
import { AdministrativeProcessMockRepository } from '#test/mocks/sga/student/administrative-process.mock-repository';
import { AdministrativeProcessDocumentMockRepository } from '#test/mocks/sga/student/administrative-process-document.mock-repository';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';

let handler: CreateAdministrativeProcessHandler;
let administrativeProcessRepository: AdministrativeProcessRepository;
let administrativeProcessDocumentRepository: AdministrativeProcessDocumentRepository;
let academicRecordGetter: AcademicRecordGetter;

let saveSpy: jest.SpyInstance;
let getAcademicRecordSpy: jest.SpyInstance;
let getIdentityDocumentSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
const identityDocument = getAnAdministrativeProcessDocument(
  AdministrativeProcessTypeEnum.IDENTITY_DOCUMENTS,
);

const command = new CreateAdministrativeProcessCommand(
  'db801d43-883a-4eaa-8a1c-339adb4a464c',
  academicRecord.id,
  'db801d43-883a-4eaa-8a1c-339adb4a464d',
  getAnAdminUser(),
);

describe('Create Administrative Process Handler', () => {
  beforeAll(() => {
    administrativeProcessRepository = new AdministrativeProcessMockRepository();
    administrativeProcessDocumentRepository =
      new AdministrativeProcessDocumentMockRepository();
    academicRecordGetter = getAnAcademicRecordGetterMock();

    saveSpy = jest.spyOn(administrativeProcessRepository, 'save');
    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'getByAdminUser');
    getIdentityDocumentSpy = jest.spyOn(
      administrativeProcessDocumentRepository,
      'getLastIdentityDocumentsByStudent',
    );

    handler = new CreateAdministrativeProcessHandler(
      administrativeProcessRepository,
      administrativeProcessDocumentRepository,
      academicRecordGetter,
    );
  });

  it('should return 404 academic record not found', async () => {
    getAcademicRecordSpy.mockImplementation(() => {
      throw new AcademicRecordNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordNotFoundException,
    );
  });

  it('should save an administrative process', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getIdentityDocumentSpy.mockImplementation(() =>
      Promise.resolve(identityDocument),
    );

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _type: AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
        _academicRecord: academicRecord,
        _createdBy: command.adminUser,
        _identityDocuments: identityDocument,
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
