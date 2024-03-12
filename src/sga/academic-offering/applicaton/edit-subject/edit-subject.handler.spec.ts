import { EditSubjectHandler } from '#academic-offering/applicaton/edit-subject/edit-subject.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject-business-unit-checker.service';
import { EditSubjectCommand } from '#academic-offering/applicaton/edit-subject/edit-subject.command';
import {
  getAnAdminUser,
  getAnEvaluationType,
  getASubject,
} from '#test/entity-factory';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import {
  getAnEvaluationTypeBusinessUnitCheckerMock,
  getAnEvaluationTypeGetterMock,
  getASubjectBusinessUnitCheckerMock,
  getASubjectGetterMock,
  getImageUploaderMock,
} from '#test/service-factory';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectDuplicatedCodeException } from '#shared/domain/exception/academic-offering/subject.duplicated-code.exception';
import clearAllMocks = jest.clearAllMocks;

let handler: EditSubjectHandler;
let repository: SubjectRepository;
let subjectGetter: SubjectGetter;
let evaluationTypeGetter: EvaluationTypeGetter;
let imageUploader: ImageUploader;
let evaluationTypeBusinessUnitChecker: EvaluationTypeBusinessUnitChecker;
let subjectBusinessUnitChecker: SubjectBusinessUnitChecker;
const subject = getASubject();
const evaluationType = getAnEvaluationType();
const adminUser = getAnAdminUser();

let saveSpy: jest.SpyInstance;
let getEvaluationTypeSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let existsByCodeSpy: jest.SpyInstance;

const command = new EditSubjectCommand(
  subject.id,
  'name',
  'code',
  30,
  null,
  SubjectModality.PRESENCIAL,
  evaluationType.id,
  null,
  SubjectType.SUBJECT,
  true,
  true,
  adminUser,
);

describe('Edit Subject Handler Unit Test', () => {
  beforeAll(() => {
    repository = new SubjectMockRepository();
    subjectGetter = getASubjectGetterMock();
    evaluationTypeGetter = getAnEvaluationTypeGetterMock();
    imageUploader = getImageUploaderMock();
    evaluationTypeBusinessUnitChecker =
      getAnEvaluationTypeBusinessUnitCheckerMock();
    subjectBusinessUnitChecker = getASubjectBusinessUnitCheckerMock();
    handler = new EditSubjectHandler(
      repository,
      subjectGetter,
      evaluationTypeGetter,
      imageUploader,
      evaluationTypeBusinessUnitChecker,
      subjectBusinessUnitChecker,
    );
    saveSpy = jest.spyOn(repository, 'save');
    getEvaluationTypeSpy = jest.spyOn(evaluationTypeGetter, 'get');
    getSubjectSpy = jest.spyOn(subjectGetter, 'get');
    existsByCodeSpy = jest.spyOn(repository, 'existsByCode');
  });

  it('should save a subject', async () => {
    adminUser.businessUnits.push(subject.businessUnit);
    evaluationType.businessUnits.push(subject.businessUnit);
    existsByCodeSpy.mockImplementation(
      (): Promise<boolean> => Promise.resolve(false),
    );
    getEvaluationTypeSpy.mockImplementation(
      (): Promise<EvaluationType> => Promise.resolve(evaluationType),
    );
    getSubjectSpy.mockImplementation(
      (): Promise<Subject> => Promise.resolve(subject),
    );
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
  it('should throw a SubjectDuplicatedCodeException', async () => {
    existsByCodeSpy.mockImplementation(
      (): Promise<boolean> => Promise.resolve(true),
    );
    await expect(handler.handle(command)).rejects.toThrow(
      SubjectDuplicatedCodeException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
