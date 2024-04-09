import clearAllMocks = jest.clearAllMocks;
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { SubjectResourceGetter } from '#academic-offering/domain/service/subject/subject-resource-getter.service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import {
  getAnAdminUser,
  getASubject,
  getASubjectResource,
} from '#test/entity-factory';
import { SubjectResourceMockRepository } from '#test/mocks/sga/academic-offering/subject-resource.mock-repository';
import {
  getASubjectGetterMock,
  getASubjectResourceGetterMock,
} from '#test/service-factory';
import { LocalStorageManager } from '#shared/infrastructure/file-manager/local-storage-manager';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import { SubjectResourceNotFoundException } from '#shared/domain/exception/academic-offering/subject-resource.not-found.exception';
import { DeleteSubjectResourceCommand } from '#academic-offering/applicaton/subject/delete-subject-resource/delete-subject-resource.command';
import { DeleteSubjectResourceHandler } from '#academic-offering/applicaton/subject/delete-subject-resource/delete-subject-resource.handler';

let handler: DeleteSubjectResourceHandler;
let repository: SubjectResourceRepository;
let subjectGetter: SubjectGetter;
let subjectResourceGetter: SubjectResourceGetter;
let fileManager: FileManager;

let deleteSpy: jest.SpyInstance;
let deleteFileSpy: jest.SpyInstance;
let getSubjectResourceSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;

const subject = getASubject();
const subjectResource = getASubjectResource();
const command = new DeleteSubjectResourceCommand(
  subject.id,
  subjectResource.id,
  getAnAdminUser(),
);

describe('Delete Subject Resource Handler', () => {
  beforeAll(() => {
    repository = new SubjectResourceMockRepository();
    subjectGetter = getASubjectGetterMock();
    subjectResourceGetter = getASubjectResourceGetterMock();
    fileManager = new LocalStorageManager();
    handler = new DeleteSubjectResourceHandler(
      repository,
      subjectGetter,
      subjectResourceGetter,
      fileManager,
    );
    deleteSpy = jest.spyOn(repository, 'delete');
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getSubjectResourceSpy = jest.spyOn(subjectResourceGetter, 'get');
    deleteFileSpy = jest.spyOn(fileManager, 'deleteFile');
  });

  it('should throw a SubjectNotFoundException', async () => {
    getSubjectSpy.mockImplementation((): Promise<Subject> => {
      throw new SubjectNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      SubjectNotFoundException,
    );
  });
  it('should throw a SubjectResourceNotFoundException', async () => {
    getSubjectSpy.mockImplementation(
      (): Promise<Subject> => Promise.resolve(subject),
    );

    getSubjectResourceSpy.mockImplementation((): Promise<SubjectResource> => {
      throw new SubjectResourceNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      SubjectResourceNotFoundException,
    );
  });
  it('should delete a subject resource', async () => {
    getSubjectSpy.mockImplementation(
      (): Promise<Subject> => Promise.resolve(subject),
    );
    getSubjectResourceSpy.mockImplementation(
      (): Promise<SubjectResource> => Promise.resolve(subjectResource),
    );
    deleteFileSpy.mockImplementation((): Promise<void> => Promise.resolve());

    await handler.handle(command);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith(subjectResource.id);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
