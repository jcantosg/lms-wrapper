import { getAnAcademicRecordGetterMock } from '#test/service-factory';
import { getAnAcademicRecord, getASGAStudent } from '#test/entity-factory';
import { UUIDv4GeneratorService } from '#shared/infrastructure/service/uuid-v4.service';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { UploadAdministrativeProcessHandler } from '#student-360/administrative-process/application/upload-administrative-process/upload-administrative-process.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { UploadAdministrativeProcessCommand } from '#student-360/administrative-process/application/upload-administrative-process/upload-administrative-process.command';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { File } from '#shared/domain/file-manager/file';
import { AdministrativeProcessMockRepository } from '#test/mocks/sga/student/administrative-process.mock-repository';
import { LocalStorageManager } from '#shared/infrastructure/file-manager/local-storage-manager';
import { InvalidAcademicRecordException } from '#shared/domain/exception/sga-student/invalid-academic-record.exception';

let handler: UploadAdministrativeProcessHandler;
let repository: AdministrativeProcessRepository;
let academicRecordGetter: AcademicRecordGetter;
let fileManager: FileManager;
let uuidGenerator: UUIDGeneratorService;

let getAcademicRecordSpy: jest.SpyInstance;
let uploadFileSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const student = getASGAStudent();
const academicRecord = getAnAcademicRecord();

const command = new UploadAdministrativeProcessCommand(
  academicRecord.id,
  AdministrativeProcessTypeEnum.PHOTO,
  [new File('uploads', 'filename.jpg', Buffer.from('test'), 'jpg')],
  student,
);

const wrongCommand = new UploadAdministrativeProcessCommand(
  null,
  AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS,
  [new File('uploads', 'filename.jpg', Buffer.from('test'), 'jpg')],
  student,
);

describe('Upload Administrative Process Handler', () => {
  beforeAll(() => {
    repository = new AdministrativeProcessMockRepository();
    academicRecordGetter = getAnAcademicRecordGetterMock();
    fileManager = new LocalStorageManager();
    uuidGenerator = new UUIDv4GeneratorService();

    saveSpy = jest.spyOn(repository, 'save');
    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'get');
    uploadFileSpy = jest.spyOn(fileManager, 'uploadFile');

    handler = new UploadAdministrativeProcessHandler(
      repository,
      academicRecordGetter,
      fileManager,
      uuidGenerator,
    );
  });

  it('should throw a InvalidAcademicRecordException', async () => {
    await expect(handler.handle(wrongCommand)).rejects.toThrow(
      InvalidAcademicRecordException,
    );
  });

  it('should create an administrative process', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );

    await handler.handle(command);
    expect(uploadFileSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
