import { UploadSubjectResourceHandler } from '#academic-offering/applicaton/subject/upload-subject-resource/upload-subject-resource.handler';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { getAFile, getAnAdminUser, getASubject } from '#test/entity-factory';
import { UploadSubjectResourceCommand } from '#academic-offering/applicaton/subject/upload-subject-resource/upload-subject-resource.command';
import { v4 as uuid } from 'uuid';
import { getASubjectGetterMock } from '#test/service-factory';
import { SubjectResourceMockRepository } from '#test/mocks/sga/academic-offering/subject-resource.mock-repository';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { LocalStorageManager } from '#shared/infrastructure/file-manager/local-storage-manager';
import clearAllMocks = jest.clearAllMocks;

let handler: UploadSubjectResourceHandler;
let repository: SubjectResourceRepository;
let subjectGetter: SubjectGetter;
let fileManager: FileManager;

let saveSpy: jest.SpyInstance;
let existsByIdSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let uploadFileSpy: jest.SpyInstance;

const subject = getASubject();
const command = new UploadSubjectResourceCommand(
  [{ id: uuid(), file: getAFile() }],
  subject.id,
  getAnAdminUser(),
);

describe('Upload Subject Resource Handler', () => {
  beforeAll(() => {
    repository = new SubjectResourceMockRepository();
    subjectGetter = getASubjectGetterMock();
    fileManager = new LocalStorageManager();
    handler = new UploadSubjectResourceHandler(
      repository,
      subjectGetter,
      fileManager,
    );
    saveSpy = jest.spyOn(repository, 'save');
    existsByIdSpy = jest.spyOn(repository, 'existsById');
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    uploadFileSpy = jest.spyOn(fileManager, 'uploadFile');
  });
  it('should save a subject resource', async () => {
    existsByIdSpy.mockImplementation(
      (): Promise<boolean> => Promise.resolve(false),
    );
    getSubjectSpy.mockImplementation(
      (): Promise<Subject> => Promise.resolve(subject),
    );
    uploadFileSpy.mockImplementation(
      (): Promise<string> => Promise.resolve('test'),
    );
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.resourceFiles[0].id,
        name: command.resourceFiles[0].file.fileName,
        url: 'test',
        size: command.resourceFiles[0].file.content.length,
        subject: subject,
      }),
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
