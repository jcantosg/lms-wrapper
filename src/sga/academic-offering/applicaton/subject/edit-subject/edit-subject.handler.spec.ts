import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/examination-type/evaluation-type-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/examination-type/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject/subject-business-unit-checker.service';
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
import { EditSubjectCommand } from '#academic-offering/applicaton/subject/edit-subject/edit-subject.command';
import { EditSubjectHandler } from '#academic-offering/applicaton/subject/edit-subject/edit-subject.handler';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import { GetLmsCourseHandler } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.handler';
import { CreateLmsCourseHandler } from '#lms-wrapper/application/lms-course/create-lms-course/create-lms-course.handler';
import { GetLmsCourseByNameHandler } from '#lms-wrapper/application/lms-course/get-lms-course-by-name/get-lms-course-by-name.handler';
import clearAllMocks = jest.clearAllMocks;

let handler: EditSubjectHandler;
let repository: SubjectRepository;
let subjectGetter: SubjectGetter;
let evaluationTypeGetter: EvaluationTypeGetter;
let imageUploader: ImageUploader;
let evaluationTypeBusinessUnitChecker: EvaluationTypeBusinessUnitChecker;
let subjectBusinessUnitChecker: SubjectBusinessUnitChecker;
let lmsCourseHandler: GetLmsCourseHandler;
let createLmsCourseHandler: CreateLmsCourseHandler;
let getLmsCourseByNameHandler: GetLmsCourseByNameHandler;
const subject = getASubject();
const evaluationType = getAnEvaluationType();
const adminUser = getAnAdminUser();

let saveSpy: jest.SpyInstance;
let getEvaluationTypeSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let existsByCodeSpy: jest.SpyInstance;
let getLmsCourseSpy: jest.SpyInstance;

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
  null,
  1,
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
    lmsCourseHandler = new GetLmsCourseHandler(new LmsCourseMockRepository());
    createLmsCourseHandler = new CreateLmsCourseHandler(
      new LmsCourseMockRepository(),
    );
    getLmsCourseByNameHandler = new GetLmsCourseByNameHandler(
      new LmsCourseMockRepository(),
    );
    handler = new EditSubjectHandler(
      repository,
      subjectGetter,
      evaluationTypeGetter,
      imageUploader,
      evaluationTypeBusinessUnitChecker,
      subjectBusinessUnitChecker,
      lmsCourseHandler,
      createLmsCourseHandler,
      getLmsCourseByNameHandler,
    );
    saveSpy = jest.spyOn(repository, 'save');
    getEvaluationTypeSpy = jest.spyOn(evaluationTypeGetter, 'get');
    getSubjectSpy = jest.spyOn(subjectGetter, 'get');
    existsByCodeSpy = jest.spyOn(repository, 'existsByCode');
    getLmsCourseSpy = jest.spyOn(lmsCourseHandler, 'handle');
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
    expect(getLmsCourseSpy).toHaveBeenCalledTimes(1);
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
