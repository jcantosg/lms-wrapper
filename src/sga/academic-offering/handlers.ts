import { CreateAcademicPeriodHandler } from '#academic-offering/applicaton/create-academic-period/create-academic-period.handler';
import { CreateExaminationCallHandler } from '#academic-offering/applicaton/create-examination-call/create-examination-call.handler';
import { GetAllAcademicPeriodsHandler } from '#academic-offering/applicaton/get-all-academic-periods/get-all-academic-periods.handler';
import { SearchAcademicPeriodsHandler } from '#academic-offering/applicaton/search-academic-periods/search-academic-periods.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { GetEvaluationTypesHandler } from '#academic-offering/applicaton/get-evaluation-types/get-evaluation-types.handler';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { GetAllSubjectsModalitiesHandler } from '#academic-offering/applicaton/get-all-subject-modalities/get-all-subjects-modalities.handler';
import { CreateSubjectHandler } from '#academic-offering/applicaton/create-subject/create-subject.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { GetAllSubjectTypesHandler } from '#academic-offering/applicaton/get-all-subject-types/get-all-subject-types.handler';
import { EditAcademicPeriodHandler } from '#academic-offering/applicaton/edit-academic-period/edit-academic-period.handler';
import { GetAcademicPeriodHandler } from '#academic-offering/applicaton/get-academic-period/get-academic-period.handler';
import { GetSubjectHandler } from '#academic-offering/applicaton/get-subject/get-subject.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject-getter.service';
import { EditSubjectHandler } from '#academic-offering/applicaton/edit-subject/edit-subject.handler';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject-business-unit-checker.service';
import { GetAllSubjectsHandler } from '#academic-offering/applicaton/get-all-subjects/get-all-subjects.handler';
import { SearchSubjectsHandler } from '#academic-offering/applicaton/search-subjects/search-subjects.handler';
import { EditExaminationCallHandler } from '#academic-offering/applicaton/edit-examination-call/edit-examination-call.handler';
import { ExaminationCallGetter } from '#academic-offering/domain/service/examination-call-getter.service';
import { CreateTitleHandler } from '#academic-offering/applicaton/create-title/create-title.handler';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { DeleteExaminationCallHandler } from '#academic-offering/applicaton/delete-examination-call/delete-examination-call.handler';
import { GetTitleListHandler } from '#academic-offering/applicaton/get-all-titles/get-title-list.handler';
import { SearchTitleHandler } from '#academic-offering/applicaton/search-title/search-title.handler';
import { CreateAcademicProgramHandler } from '#academic-offering/applicaton/create-academic-program/create-academic-program.handler';
import { TitleGetter } from '#academic-offering/domain/service/title-getter.service';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { GetAllTitlesPlainHandler } from '#academic-offering/applicaton/get-all-titles-plain/get-all-titles-plain.handler';
import { UploadSubjectResourceHandler } from '#academic-offering/applicaton/upload-subject-resource/upload-subject-resource.handler';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';
import { AddEdaeUsersToSubjectHandler } from '#academic-offering/applicaton/add-edae-users-to-subject/add-edae-users-to-subject.handler';
import { DeleteSubjectResourceHandler } from '#academic-offering/applicaton/delete-subject-resource/delete-subject-resource.handler';
import { SubjectResourceGetter } from '#academic-offering/domain/service/subject-resource-getter.service';
import { DeleteTitleHandler } from '#academic-offering/applicaton/delete-title/delete-title.handler';
import { GetAcademicProgramHandler } from '#academic-offering/applicaton/get-academic-program/get-academic-program.handler';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program-getter.service';
import { RemoveEdaeUserFromSubjectHandler } from '#academic-offering/applicaton/remove-edae-from-subject/remove-edae-user-from-subject.handler';
import { GetAllAcademicProgramsHandler } from '#academic-offering/applicaton/get-all-academic-programs/get-all-academic-programs.handler';
import { SearchAcademicProgramsHandler } from '#academic-offering/applicaton/search-academic-programs/search-academic-programs.handler';
import { EditTitleHandler } from '#academic-offering/applicaton/edit-title/edit-title.handler';
import { GetTitleDetailHandler } from '#academic-offering/applicaton/get-title-detail/get-title-detail.handler';
import { EditAcademicProgramHandler } from '#academic-offering/applicaton/edit-academic-program/edit-academic-program.handler';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';

const createAcademicPeriodHandler = {
  provide: CreateAcademicPeriodHandler,
  useFactory: (
    repository: AcademicPeriodRepository,
    examinationCallRepository: ExaminationCallRepository,
    businessUnitGetter: BusinessUnitGetter,
    eventDispatcher: EventDispatcher,
  ) => {
    return new CreateAcademicPeriodHandler(
      repository,
      examinationCallRepository,
      businessUnitGetter,
      eventDispatcher,
    );
  },
  inject: [
    AcademicPeriodRepository,
    ExaminationCallRepository,
    BusinessUnitGetter,
    EventDispatcher,
  ],
};

const createExaminationCallHandler = {
  provide: CreateExaminationCallHandler,
  useFactory: (
    repository: ExaminationCallRepository,
    academicPeriodGetter: AcademicPeriodGetter,
  ) => {
    return new CreateExaminationCallHandler(repository, academicPeriodGetter);
  },
  inject: [ExaminationCallRepository, AcademicPeriodGetter],
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

const editAcademicPeriodHandler = {
  provide: EditAcademicPeriodHandler,
  useFactory: (
    getter: AcademicPeriodGetter,
    repository: AcademicPeriodRepository,
  ) => {
    return new EditAcademicPeriodHandler(getter, repository);
  },
  inject: [AcademicPeriodGetter, AcademicPeriodRepository],
};

const getAcademicPeriodHandler = {
  provide: GetAcademicPeriodHandler,
  useFactory: (getter: AcademicPeriodGetter) => {
    return new GetAcademicPeriodHandler(getter);
  },
  inject: [AcademicPeriodGetter],
};

const getSubjectHandler = {
  provide: GetSubjectHandler,
  useFactory: (getter: SubjectGetter) => {
    return new GetSubjectHandler(getter);
  },
  inject: [SubjectGetter],
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

const editExaminationCallHandler = {
  provide: EditExaminationCallHandler,
  useFactory: (
    repository: ExaminationCallRepository,
    getter: ExaminationCallGetter,
  ) => {
    return new EditExaminationCallHandler(repository, getter);
  },
  inject: [ExaminationCallRepository, ExaminationCallGetter],
};

const createTitleHandler = {
  provide: CreateTitleHandler,
  useFactory: (
    repository: TitleRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => new CreateTitleHandler(repository, businessUnitGetter),
  inject: [TitleRepository, BusinessUnitGetter],
};

const deleteExaminationCallHandler = {
  provide: DeleteExaminationCallHandler,
  useFactory: (
    repository: ExaminationCallRepository,
    getter: ExaminationCallGetter,
  ): DeleteExaminationCallHandler =>
    new DeleteExaminationCallHandler(repository, getter),
  inject: [ExaminationCallRepository, ExaminationCallGetter],
};

const getAllTitlesHandler = {
  provide: GetTitleListHandler,
  useFactory: (repository: TitleRepository) =>
    new GetTitleListHandler(repository),
  inject: [TitleRepository],
};

const searchTitlesHandler = {
  provide: SearchTitleHandler,
  useFactory: (repository: TitleRepository) =>
    new SearchTitleHandler(repository),
  inject: [TitleRepository],
};

const createAcademicProgramHandler = {
  provide: CreateAcademicProgramHandler,
  useFactory: (
    repository: AcademicProgramRepository,
    businessUnitGetter: BusinessUnitGetter,
    titleGetter: TitleGetter,
  ) =>
    new CreateAcademicProgramHandler(
      repository,
      businessUnitGetter,
      titleGetter,
    ),
  inject: [AcademicProgramRepository, BusinessUnitGetter, TitleGetter],
};

const getAllTitlesPlainHandler = {
  provide: GetAllTitlesPlainHandler,
  useFactory: (
    repository: TitleRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => new GetAllTitlesPlainHandler(repository, businessUnitGetter),
  inject: [TitleRepository, BusinessUnitGetter],
};

const uploadResourceHandler = {
  provide: UploadSubjectResourceHandler,
  useFactory: (
    repository: SubjectResourceRepository,
    subjectGetter: SubjectGetter,
    fileManager: FileManager,
  ) => new UploadSubjectResourceHandler(repository, subjectGetter, fileManager),
  inject: [SubjectResourceRepository, SubjectGetter, FileManager],
};

const addEdaeUsersToSubjectHandler = {
  provide: AddEdaeUsersToSubjectHandler,
  useFactory: (
    subjectRepository: SubjectRepository,
    subjectGetter: SubjectGetter,
    edaeUserGetter: EdaeUserGetter,
    edaeUserBusinessUnitChecker: EdaeUserBusinessUnitChecker,
  ) => {
    return new AddEdaeUsersToSubjectHandler(
      subjectRepository,
      subjectGetter,
      edaeUserGetter,
      edaeUserBusinessUnitChecker,
    );
  },
  inject: [
    SubjectRepository,
    SubjectGetter,
    EdaeUserGetter,
    EdaeUserBusinessUnitChecker,
  ],
};

const deleteResourceHandler = {
  provide: DeleteSubjectResourceHandler,
  useFactory: (
    repository: SubjectResourceRepository,
    subjectGetter: SubjectGetter,
    subjectResourceGetter: SubjectResourceGetter,
    fileManager: FileManager,
  ) =>
    new DeleteSubjectResourceHandler(
      repository,
      subjectGetter,
      subjectResourceGetter,
      fileManager,
    ),
  inject: [
    SubjectResourceRepository,
    SubjectGetter,
    SubjectResourceGetter,
    FileManager,
  ],
};

const deleteTitleHandler = {
  provide: DeleteTitleHandler,
  useFactory: (
    repository: TitleRepository,
    getter: TitleGetter,
  ): DeleteTitleHandler => new DeleteTitleHandler(repository, getter),
  inject: [TitleRepository, TitleGetter],
};

const getAcademicProgramHandler = {
  provide: GetAcademicProgramHandler,
  useFactory: (getter: AcademicProgramGetter) => {
    return new GetAcademicProgramHandler(getter);
  },
  inject: [AcademicProgramGetter],
};

const removeEdaeUsersFromSubjectHandler = {
  provide: RemoveEdaeUserFromSubjectHandler,
  useFactory: (
    subjectRepository: SubjectRepository,
    subjectGetter: SubjectGetter,
    edaeUserGetter: EdaeUserGetter,
  ) => {
    return new RemoveEdaeUserFromSubjectHandler(
      subjectRepository,
      subjectGetter,
      edaeUserGetter,
    );
  },
  inject: [SubjectRepository, SubjectGetter, EdaeUserGetter],
};

const getAllAcademicProgramsHandler = {
  provide: GetAllAcademicProgramsHandler,
  useFactory: (repository: AcademicProgramRepository) =>
    new GetAllAcademicProgramsHandler(repository),
  inject: [AcademicProgramRepository],
};

const searchAcademicProgramsHandler = {
  provide: SearchAcademicProgramsHandler,
  useFactory: (repository: AcademicProgramRepository) =>
    new SearchAcademicProgramsHandler(repository),
  inject: [AcademicProgramRepository],
};

const editTitleHandler = {
  provide: EditTitleHandler,
  useFactory: (
    titleRepository: TitleRepository,
    titleGetter: TitleGetter,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new EditTitleHandler(
      titleRepository,
      titleGetter,
      businessUnitGetter,
    );
  },
  inject: [TitleRepository, TitleGetter, BusinessUnitGetter],
};

const getTitleDetailHandler = {
  provide: GetTitleDetailHandler,
  useFactory: (titleGetter: TitleGetter) => {
    return new GetTitleDetailHandler(titleGetter);
  },
  inject: [TitleGetter],
};

const editAcademicProgramHandler = {
  provide: EditAcademicProgramHandler,
  useFactory: (
    academicProgramRepository: AcademicProgramRepository,
    academicProgramGetter: AcademicProgramGetter,
    titleGetter: TitleGetter,
  ) => {
    return new EditAcademicProgramHandler(
      academicProgramRepository,
      academicProgramGetter,
      titleGetter,
    );
  },
  inject: [AcademicProgramRepository, AcademicProgramGetter, TitleGetter],
};

export const handlers = [
  createAcademicPeriodHandler,
  getAllAcademicPeriodsHandler,
  createExaminationCallHandler,
  searchAcademicPeriodsHandler,
  getEvaluationTypesHandler,
  GetAllSubjectsModalitiesHandler,
  GetAllSubjectTypesHandler,
  createSubjectHandler,
  editAcademicPeriodHandler,
  getAcademicPeriodHandler,
  getSubjectHandler,
  getAllSubjectsHandler,
  searchSubjectsHandler,
  editSubjectHandler,
  editExaminationCallHandler,
  createTitleHandler,
  getAllTitlesHandler,
  searchTitlesHandler,
  createAcademicProgramHandler,
  getAllTitlesPlainHandler,
  uploadResourceHandler,
  addEdaeUsersToSubjectHandler,
  deleteResourceHandler,
  deleteExaminationCallHandler,
  deleteTitleHandler,
  getAcademicProgramHandler,
  removeEdaeUsersFromSubjectHandler,
  getAllAcademicProgramsHandler,
  searchAcademicProgramsHandler,
  editTitleHandler,
  getTitleDetailHandler,
  editAcademicProgramHandler,
];
