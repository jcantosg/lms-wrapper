import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { EvaluationTypeGetter } from '#academic-offering/domain/service/examination-type/evaluation-type-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { EvaluationTypeBusinessUnitChecker } from '#academic-offering/domain/service/examination-type/evaluation-type-business-unit-checker.service';
import { SubjectBusinessUnitChecker } from '#academic-offering/domain/service/subject/subject-business-unit-checker.service';
import { CreateSubjectHandler } from '#academic-offering/applicaton/subject/create-subject/create-subject.handler';
import { GetSubjectHandler } from '#academic-offering/applicaton/subject/get-subject/get-subject.handler';
import { EditSubjectHandler } from '#academic-offering/applicaton/subject/edit-subject/edit-subject.handler';
import { GetAllSubjectsHandler } from '#academic-offering/applicaton/subject/get-all-subjects/get-all-subjects.handler';
import { SearchSubjectsHandler } from '#academic-offering/applicaton/subject/search-subjects/search-subjects.handler';
import { UploadSubjectResourceHandler } from '#academic-offering/applicaton/subject/upload-subject-resource/upload-subject-resource.handler';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { AddEdaeUsersToSubjectHandler } from '#academic-offering/applicaton/subject/add-edae-users-to-subject/add-edae-users-to-subject.handler';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';
import { SubjectResourceGetter } from '#academic-offering/domain/service/subject/subject-resource-getter.service';
import { DeleteSubjectResourceHandler } from '#academic-offering/applicaton/subject/delete-subject-resource/delete-subject-resource.handler';
import { RemoveEdaeUserFromSubjectHandler } from '#academic-offering/applicaton/subject/remove-edae-from-subject/remove-edae-user-from-subject.handler';
import { GetAllSubjectsModalitiesHandler } from '#academic-offering/applicaton/subject/get-all-subject-modalities/get-all-subjects-modalities.handler';
import { GetAllSubjectTypesHandler } from '#academic-offering/applicaton/subject/get-all-subject-types/get-all-subject-types.handler';
import { GetSubjectsByBusinessUnitHandler } from '#academic-offering/applicaton/subject/get-subjects-by-business-unit/get-subjects-by-business-unit.handler';
import { SetDefaultTeacherToSubjectHandler } from '#academic-offering/applicaton/subject/set-default-teacher-to-subject/set-default-teacher-to-subject.handler';
import { GetLmsCourseHandler } from '#/lms-wrapper/application/lms-course/get-lms-course/get-lms-course.handler';
import { GetAllSubjectEdaeUsersHandler } from '#academic-offering/applicaton/subject/get-all-subject-edae-users/get-all-subject-edae-users.handler';
import { CreateLmsCourseHandler } from '#lms-wrapper/application/lms-course/create-lms-course/create-lms-course.handler';
import { GetLmsCourseByNameHandler } from '#lms-wrapper/application/lms-course/get-lms-course-by-name/get-lms-course-by-name.handler';

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
    lmsCourseHandler: GetLmsCourseHandler,
    createLmsCourseHandler: CreateLmsCourseHandler,
    getLmsCourseByNameHandler: GetLmsCourseByNameHandler,
  ): EditSubjectHandler =>
    new EditSubjectHandler(
      repository,
      subjectGetter,
      evaluationTypeGetter,
      imageUploader,
      evaluationTypeBusinessUnitChecker,
      subjectBusinessUnitChecker,
      lmsCourseHandler,
      createLmsCourseHandler,
      getLmsCourseByNameHandler,
    ),
  inject: [
    SubjectRepository,
    SubjectGetter,
    EvaluationTypeGetter,
    ImageUploader,
    EvaluationTypeBusinessUnitChecker,
    SubjectBusinessUnitChecker,
    GetLmsCourseHandler,
    CreateLmsCourseHandler,
    GetLmsCourseByNameHandler,
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

const uploadSubjectResourceHandler = {
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

const deleteSubjectResourceHandler = {
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

const getSubjectsByBusinessUnit = {
  provide: GetSubjectsByBusinessUnitHandler,
  useFactory: (repository: SubjectRepository) =>
    new GetSubjectsByBusinessUnitHandler(repository),
  inject: [SubjectRepository],
};

const setDefaultTeacherToSubjectHandler = {
  provide: SetDefaultTeacherToSubjectHandler,
  useFactory: (
    repository: SubjectRepository,
    subjectGetter: SubjectGetter,
    edaeUserGetter: EdaeUserGetter,
  ) => {
    return new SetDefaultTeacherToSubjectHandler(
      repository,
      subjectGetter,
      edaeUserGetter,
    );
  },
  inject: [SubjectRepository, SubjectGetter, EdaeUserGetter],
};

const getAllSubjectEdaeUsersHandler = {
  provide: GetAllSubjectEdaeUsersHandler,
  useFactory: (subjectGetter: SubjectGetter) => {
    return new GetAllSubjectEdaeUsersHandler(subjectGetter);
  },
  inject: [SubjectGetter],
};

export const subjectHandlers = [
  createSubjectHandler,
  getSubjectHandler,
  editSubjectHandler,
  getAllSubjectsHandler,
  searchSubjectsHandler,
  uploadSubjectResourceHandler,
  addEdaeUsersToSubjectHandler,
  deleteSubjectResourceHandler,
  removeEdaeUsersFromSubjectHandler,
  GetAllSubjectsModalitiesHandler,
  GetAllSubjectTypesHandler,
  getSubjectsByBusinessUnit,
  setDefaultTeacherToSubjectHandler,
  getAllSubjectEdaeUsersHandler,
];
