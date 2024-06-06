import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/examination-type/evaluation-type-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import {
  getAnEvaluationTypeGetterMock,
  getBusinessUnitGetterMock,
  getImageUploaderMock,
} from '#test/service-factory';
import {
  getABusinessUnit,
  getAnAdminUser,
  getAnEvaluationType,
} from '#test/entity-factory';
import { v4 as uuid } from 'uuid';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { SubjectDuplicatedCodeException } from '#shared/domain/exception/academic-offering/subject.duplicated-code.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { CreateSubjectHandler } from '#academic-offering/applicaton/subject/create-subject/create-subject.handler';
import { CreateSubjectCommand } from '#academic-offering/applicaton/subject/create-subject/create-subject.command';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { LmsCourseMockRepository } from '#test/mocks/lms-wrapper/lms-course.mock-repository';
import clearAllMocks = jest.clearAllMocks;

let handler: CreateSubjectHandler;
let repository: SubjectRepository;
let evaluationTypeGetter: EvaluationTypeGetter;
let businessUnitGetter: BusinessUnitGetter;
let imageUploader: ImageUploader;
let lmsCourseRepository: LmsCourseRepository;

let saveSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getEvaluationType: jest.SpyInstance;
let existsByCodeSpy: jest.SpyInstance;
let getLmsCourseSpy: jest.SpyInstance;

const evaluationType = getAnEvaluationType();
const businessUnit = getABusinessUnit();
const command = new CreateSubjectCommand(
  uuid(),
  'test',
  'code',
  null,
  null,
  20,
  SubjectModality.ELEARNING,
  evaluationType.id,
  SubjectType.SUBJECT,
  businessUnit.id,
  true,
  true,
  getAnAdminUser(),
  'MUR',
  1,
);

describe('Create Subject Handler', () => {
  beforeAll(() => {
    repository = new SubjectMockRepository();
    evaluationTypeGetter = getAnEvaluationTypeGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();
    imageUploader = getImageUploaderMock();
    lmsCourseRepository = new LmsCourseMockRepository();
    handler = new CreateSubjectHandler(
      repository,
      evaluationTypeGetter,
      businessUnitGetter,
      imageUploader,
      lmsCourseRepository,
    );
    saveSpy = jest.spyOn(repository, 'save');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getEvaluationType = jest.spyOn(evaluationTypeGetter, 'get');
    existsByCodeSpy = jest.spyOn(repository, 'existsByCode');
    getLmsCourseSpy = jest.spyOn(lmsCourseRepository, 'getOne');
  });
  it('should throw a SubjectDuplicatedCodeException', async () => {
    existsByCodeSpy.mockImplementation(
      (): Promise<boolean> => Promise.resolve(true),
    );
    await expect(handler.handle(command)).rejects.toThrow(
      SubjectDuplicatedCodeException,
    );
  });
  it('should save a subject', async () => {
    existsByCodeSpy.mockImplementation(
      (): Promise<boolean> => Promise.resolve(false),
    );
    getBusinessUnitSpy.mockImplementation(
      (): Promise<BusinessUnit> => Promise.resolve(businessUnit),
    );
    getEvaluationType.mockImplementation(
      (): Promise<EvaluationType> => Promise.resolve(evaluationType),
    );
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(getLmsCourseSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _name: command.name,
        _code: command.code,
        _officialCode: command.officialCode,
        _businessUnit: businessUnit,
        _evaluationType: evaluationType,
        _createdBy: command.adminUser,
      }),
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
