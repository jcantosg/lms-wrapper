import { GetAccessQualificationsHandler } from '#student/application/get-access-qualifications/get-access-qualifications.handler';
import { CreateStudentHandler } from '#student/application/create-student/create-student.handler';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { EditStudentHandler } from '#student/application/edit-student/edit-student.handler';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { GetStudentsHandler } from '#student/application/get-students/get-students.handler';
import { SearchStudentsHandler } from '#student/application/search-students/search-students.handler';
import { academicRecordHandlers } from '#student/application/academic-record/handlers';
import { GetStudentHandler } from '#student/application/get-student/get-student.handler';
import { enrollmentHandlers } from '#student/application/enrollment/handlers';
import { administrativeGroupHandlers } from '#student/application/administrative-group/handlers';
import { CreateInternalGroupsBatchHandler } from '#student/application/create-internal-group-batch/create-internal-group-batch.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';

const getAccessQualificationsHandler = {
  provide: GetAccessQualificationsHandler,
  useFactory: (): GetAccessQualificationsHandler =>
    new GetAccessQualificationsHandler(),
};

const createStudentHandler = {
  provide: CreateStudentHandler,
  useFactory: (
    repository: StudentRepository,
    passwordEncoder: PasswordEncoder,
  ): CreateStudentHandler =>
    new CreateStudentHandler(repository, passwordEncoder),
  inject: [StudentRepository, PasswordEncoder],
};

const editStudentHandler = {
  provide: EditStudentHandler,
  useFactory: (
    repository: StudentRepository,
    studentGetter: StudentGetter,
    countryGetter: CountryGetter,
    imageUploader: ImageUploader,
  ): EditStudentHandler =>
    new EditStudentHandler(
      repository,
      studentGetter,
      countryGetter,
      imageUploader,
    ),
  inject: [StudentRepository, StudentGetter, CountryGetter, ImageUploader],
};

const getStudentsHandler = {
  provide: GetStudentsHandler,
  useFactory: (repository: StudentRepository): GetStudentsHandler =>
    new GetStudentsHandler(repository),
  inject: [StudentRepository],
};

const searchStudentHandler = {
  provide: SearchStudentsHandler,
  useFactory: (repository: StudentRepository): SearchStudentsHandler =>
    new SearchStudentsHandler(repository),
  inject: [StudentRepository],
};

const getStudentHandler = {
  provide: GetStudentHandler,
  useFactory: (studentGetter: StudentGetter): GetStudentHandler =>
    new GetStudentHandler(studentGetter),
  inject: [StudentGetter],
};

const createInternalGroupsBatchHandler = {
  provide: CreateInternalGroupsBatchHandler,
  useFactory: (
    repository: InternalGroupRepository,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    blockRelationRepository: BlockRelationRepository,
    uuidGenerator: UUIDGeneratorService,
  ): CreateInternalGroupsBatchHandler =>
    new CreateInternalGroupsBatchHandler(
      repository,
      academicPeriodGetter,
      academicProgramGetter,
      blockRelationRepository,
      uuidGenerator,
    ),
  inject: [
    InternalGroupRepository,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    BlockRelationRepository,
    UUIDGeneratorService,
  ],
};

export const handlers = [
  getAccessQualificationsHandler,
  createStudentHandler,
  editStudentHandler,
  getStudentsHandler,
  searchStudentHandler,
  getStudentHandler,
  ...academicRecordHandlers,
  createInternalGroupsBatchHandler,
  ...enrollmentHandlers,
  ...administrativeGroupHandlers,
];
