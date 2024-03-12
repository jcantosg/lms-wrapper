import { CreateAcademicPeriodHandler } from '#academic-offering/applicaton/create-academic-period/create-academic-period.handler';
import { GetAllAcademicPeriodsHandler } from '#academic-offering/applicaton/get-all-academic-periods/get-all-academic-periods.handler';
import { SearchAcademicPeriodsHandler } from '#academic-offering/applicaton/search-academic-periods/search-academic-periods.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { GetEvaluationTypesHandler } from '#academic-offering/applicaton/get-evaluation-types/get-evaluation-types.handler';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { GetAllSubjectsModalitiesHandler } from '#academic-offering/applicaton/get-all-subject-modalities/get-all-subjects-modalities.handler';
import { CreateSubjectHandler } from '#academic-offering/applicaton/create-subject/create-subject.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { GetAllSubjectTypesHandler } from '#academic-offering/applicaton/get-all-subject-types/get-all-subject-types.handler';
import { EditSubjectHandler } from '#academic-offering/applicaton/edit-subject/edit-subject.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject-business-unit-checker.service';
import { GetAllSubjectsHandler } from '#academic-offering/applicaton/get-all-subjects/get-all-subjects.handler';
import { SearchSubjectsHandler } from '#academic-offering/applicaton/search-subjects/search-subjects.handler';

const createAcademicPeriodHandler = {
  provide: CreateAcademicPeriodHandler,
  useFactory: (
    repository: AcademicPeriodRepository,
    examinationCallRepository: ExaminationCallRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new CreateAcademicPeriodHandler(
      repository,
      examinationCallRepository,
      businessUnitGetter,
    );
  },
  inject: [
    AcademicPeriodRepository,
    ExaminationCallRepository,
    BusinessUnitGetter,
  ],
};

const getAllAcademicPeriodsHandler = {
  provide: GetAllAcademicPeriodsHandler,
  useFactory: (repository: AcademicPeriodRepository) => {
    return new GetAllAcademicPeriodsHandler(repository);
  },
  inject: [AcademicPeriodRepository],
};

const searchAcademicPeriodsHandler = {
  provide: SearchAcademicPeriodsHandler,
  useFactory: (repository: AcademicPeriodRepository) => {
    return new SearchAcademicPeriodsHandler(repository);
  },
  inject: [AcademicPeriodRepository],
};

const getEvaluationTypesHandler = {
  provide: GetEvaluationTypesHandler,
  useFactory: (
    repository: EvaluationTypeRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new GetEvaluationTypesHandler(repository, businessUnitGetter);
  },
  inject: [EvaluationTypeRepository, BusinessUnitGetter],
};

const createSubjectHandler = {
  provide: CreateSubjectHandler,
  useFactory: (
    repository: SubjectRepository,
    evaluationTypeGetter: EvaluationTypeGetter,
    businessUnitGetter: BusinessUnitGetter,
    imageUploader: ImageUploader,
  ) =>
    new CreateSubjectHandler(
      repository,
      evaluationTypeGetter,
      businessUnitGetter,
      imageUploader,
    ),
  inject: [
    SubjectRepository,
    EvaluationTypeGetter,
    BusinessUnitGetter,
    ImageUploader,
  ],
};

const editSubjectHandler = {
  provide: EditSubjectHandler,
  useFactory: (
    repository: SubjectRepository,
    subjectGetter: SubjectGetter,
    evaluationTypeGetter: EvaluationTypeGetter,
    imageUploader: ImageUploader,
    evaluationTypeBusinessUnitChecker: EvaluationTypeBusinessUnitChecker,
    subjectBusinessUnitChecker: SubjectBusinessUnitChecker,
  ) =>
    new EditSubjectHandler(
      repository,
      subjectGetter,
      evaluationTypeGetter,
      imageUploader,
      evaluationTypeBusinessUnitChecker,
      subjectBusinessUnitChecker,
    ),
  inject: [
    SubjectRepository,
    SubjectGetter,
    EvaluationTypeGetter,
    ImageUploader,
    EvaluationTypeBusinessUnitChecker,
    SubjectBusinessUnitChecker,
  ],
};

const getAllSubjectsHandler = {
  provide: GetAllSubjectsHandler,
  useFactory: (repository: SubjectRepository) => {
    return new GetAllSubjectsHandler(repository);
  },
  inject: [SubjectRepository],
};

const searchSubjectsHandler = {
  provide: SearchSubjectsHandler,
  useFactory: (repository: SubjectRepository) => {
    return new SearchSubjectsHandler(repository);
  },
  inject: [SubjectRepository],
};

export const handlers = [
  createAcademicPeriodHandler,
  getAllAcademicPeriodsHandler,
  searchAcademicPeriodsHandler,
  getEvaluationTypesHandler,
  GetAllSubjectsModalitiesHandler,
  GetAllSubjectTypesHandler,
  createSubjectHandler,
  getAllSubjectsHandler,
  searchSubjectsHandler,
  editSubjectHandler,
];
