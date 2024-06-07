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
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { GetInternalGroupsHandler } from '#student/application/get-internal-groups/get-internal-groups.handler';
import { SearchInternalGroupsHandler } from '#student/application/search-internal-groups/search-internal-groups.handler';
import { AddInternalGroupToAcademicPeriodHandler } from '#student/application/add-internal-group-to-academic-period/add-internal-group-to-academic-period.handler';
import { CreateStudentFromCRMHandler } from '#student/application/create-student-from-crm/create-student-from-crm.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { CRMImportRepository } from '#shared/domain/repository/crm-import.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { ConfigService } from '@nestjs/config';
import { subjectCallHandlers } from '#student/application/subject-call/handlers';
import { EnrollmentCreator } from '#student/domain/service/enrollment-creator.service';
import { CreateStudentFromCRMTransactionalService } from '#student/domain/service/create-student-from-crm.transactional-service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';

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

const addInternalGroupToAcademicPeriodHandler = {
  provide: AddInternalGroupToAcademicPeriodHandler,
  useFactory: (
    repository: InternalGroupRepository,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    subjectGetter: SubjectGetter,
    blockRelationRepository: BlockRelationRepository,
    edaeUserGetter: EdaeUserGetter,
  ): AddInternalGroupToAcademicPeriodHandler =>
    new AddInternalGroupToAcademicPeriodHandler(
      repository,
      academicPeriodGetter,
      subjectGetter,
      academicProgramGetter,
      blockRelationRepository,
      edaeUserGetter,
    ),
  inject: [
    InternalGroupRepository,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    SubjectGetter,
    BlockRelationRepository,
    EdaeUserGetter,
  ],
};

const listInternalGroupsHandler = {
  provide: GetInternalGroupsHandler,
  useFactory: (repository: InternalGroupRepository): GetInternalGroupsHandler =>
    new GetInternalGroupsHandler(repository),
  inject: [InternalGroupRepository],
};

const searchInternalGroupsHandler = {
  provide: SearchInternalGroupsHandler,
  useFactory: (
    repository: InternalGroupRepository,
  ): SearchInternalGroupsHandler => new SearchInternalGroupsHandler(repository),
  inject: [InternalGroupRepository],
};

const createStudentFromCRMHandler = {
  provide: CreateStudentFromCRMHandler,
  useFactory: (
    repository: StudentRepository,
    passwordEncoder: PasswordEncoder,
    businessUnitGetter: BusinessUnitGetter,
    virtualCampusGetter: VirtualCampusGetter,
    academicPeriodGetter: AcademicPeriodGetter,
    academicProgramGetter: AcademicProgramGetter,
    crmImportRepository: CRMImportRepository,
    adminUserGetter: AdminUserGetter,
    configService: ConfigService,
    countryGetter: CountryGetter,
    academicRecordRepository: AcademicRecordRepository,
    enrollmentCreator: EnrollmentCreator,
    createStudentFromCRMTransactionalService: CreateStudentFromCRMTransactionalService,
    enrollmentGetter: EnrollmentGetter,
  ): CreateStudentFromCRMHandler => {
    const adminEmail = configService.get<string>(
      'ADMIN_USER_EMAIL',
      'sga@universae.com',
    );

    return new CreateStudentFromCRMHandler(
      repository,
      passwordEncoder,
      businessUnitGetter,
      virtualCampusGetter,
      academicPeriodGetter,
      academicProgramGetter,
      crmImportRepository,
      adminUserGetter,
      adminEmail,
      countryGetter,
      academicRecordRepository,
      enrollmentCreator,
      createStudentFromCRMTransactionalService,
      enrollmentGetter,
    );
  },
  inject: [
    StudentRepository,
    PasswordEncoder,
    BusinessUnitGetter,
    VirtualCampusGetter,
    AcademicPeriodGetter,
    AcademicProgramGetter,
    CRMImportRepository,
    AdminUserGetter,
    ConfigService,
    CountryGetter,
    AcademicRecordRepository,
    EnrollmentCreator,
    CreateStudentFromCRMTransactionalService,
    EnrollmentGetter,
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
  ...subjectCallHandlers,
  addInternalGroupToAcademicPeriodHandler,
  listInternalGroupsHandler,
  searchInternalGroupsHandler,
  ...subjectCallHandlers,
  createStudentFromCRMHandler,
];
