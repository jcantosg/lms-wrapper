import { GetAccessQualificationsHandler } from '#student/application/get-access-qualifications/get-access-qualifications.handler';
import { CreateStudentHandler } from '#student/application/create-student/create-student.handler';
import { StudentRepository } from '#shared/domain/repository/student.repository';
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
import { CreateStudentFromSGATransactionService } from '#student/domain/service/create-student-from-SGA.transactional-service';
import { EnrollmentCreator } from '#student/domain/service/enrollment-creator.service';
import { CreateStudentFromCRMTransactionalService } from '#student/domain/service/create-student-from-crm.transactional-service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { GetAllStudentsByAdministrativeGroupHandler } from '#student/application/get-all-students-by-administrative-group/get-all-students-by-administrative-group.handler';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { AdministrativeGroupStatusStudentGetter } from '#student/domain/service/administrative-group-status-student.getter.service';
import { SearchStudentsByAdministrativeGroupHandler } from '#student/application/search-students-by-administrative-group/search-students-by-administrative-group.handler';
import { AddTeacherToInternalGroupHandler } from '#student/application/add-teacher-to-internal-group/add-teacher-to-internal-group.handler';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { GetInternalGroupDetailHandler } from '#student/application/get-internal-group-detail/get-internal-group-detail.handler';
import { EditInternalGroupHandler } from '#student/application/edit-internal-group/edit-internal-group.handler';
import { GetCoursingSubjectStudentsHandler } from '#student/application/get-coursing-subject-students/get-coursing-subject-students.handler';
import { AddStudentToInternalGroupHandler } from '#student/application/add-student-to-internal-group/add-student-to-internal-group.handler';
import { GetInternalGroupStudentsHandler } from '#student/application/get-internal-group-students/get-internal-group-students.handler';
import { RemoveTeacherFromInternalGroupHandler } from '#student/application/remove-teacher-from-internal-group/remove-teacher-from-internal-group.handler';
import { RemoveStudentFromInternalGroupHandler } from '#student/application/remove-student-from-internal-group/remove-student-from-internal-group.handler';
import { UpdateInternalGroupsService } from '#student/domain/service/update-internal-groups.service';
import { UpdateAdministrativeGroupsService } from '#student/domain/service/update-administrative-groups.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { CreateAdministrativeProcessHandler } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { GetAllAdministrativeProcessesHandler } from '#student/application/administrative-process/get-all-administrative-processes/get-all-administrative-processes.handler';
import { SearchAdministrativeProcessesHandler } from '#student/application/administrative-process/search-administrative-processes/search-administrative-processes.handler';

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
    transactionalService: CreateStudentFromSGATransactionService,
  ): CreateStudentHandler =>
    new CreateStudentHandler(repository, passwordEncoder, transactionalService),
  inject: [
    StudentRepository,
    PasswordEncoder,
    CreateStudentFromSGATransactionService,
  ],
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
    updateInternalGroupsService: UpdateInternalGroupsService,
    updateAdministrativeGroupsService: UpdateAdministrativeGroupsService,
    eventDispatcher: EventDispatcher,
    uuidService: UUIDGeneratorService,
    createAdministrativeProcessHandler: CreateAdministrativeProcessHandler,
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
      updateInternalGroupsService,
      updateAdministrativeGroupsService,
      eventDispatcher,
      uuidService,
      createAdministrativeProcessHandler,
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
    UpdateInternalGroupsService,
    UpdateAdministrativeGroupsService,
    EventDispatcher,
    UUIDGeneratorService,
    CreateAdministrativeProcessHandler,
  ],
};

const getAllStudentsByAdministrativeGroupHandler = {
  provide: GetAllStudentsByAdministrativeGroupHandler,
  useFactory: (
    studentsRepository: StudentRepository,
    academicRecordRepository: AcademicRecordRepository,
    administrativeGroupGetter: AdministrativeGroupGetter,
    administrativeGroupStatusStudentGetter: AdministrativeGroupStatusStudentGetter,
  ): GetAllStudentsByAdministrativeGroupHandler =>
    new GetAllStudentsByAdministrativeGroupHandler(
      studentsRepository,
      academicRecordRepository,
      administrativeGroupGetter,
      administrativeGroupStatusStudentGetter,
    ),
  inject: [
    StudentRepository,
    AcademicRecordRepository,
    AdministrativeGroupGetter,
    AdministrativeGroupStatusStudentGetter,
  ],
};

const searchStudentsByAdministrativeGroupHandler = {
  provide: SearchStudentsByAdministrativeGroupHandler,
  useFactory: (
    studentsRepository: StudentRepository,
    academicRecordRepository: AcademicRecordRepository,
    administrativeGroupGetter: AdministrativeGroupGetter,
    administrativeGroupStatusStudentGetter: AdministrativeGroupStatusStudentGetter,
  ): SearchStudentsByAdministrativeGroupHandler =>
    new SearchStudentsByAdministrativeGroupHandler(
      studentsRepository,
      academicRecordRepository,
      administrativeGroupGetter,
      administrativeGroupStatusStudentGetter,
    ),
  inject: [
    StudentRepository,
    AcademicRecordRepository,
    AdministrativeGroupGetter,
    AdministrativeGroupStatusStudentGetter,
  ],
};

const getInternalGroupDetailHandler = {
  provide: GetInternalGroupDetailHandler,
  useFactory: (
    internalGroupGetter: InternalGroupGetter,
  ): GetInternalGroupDetailHandler =>
    new GetInternalGroupDetailHandler(internalGroupGetter),
  inject: [InternalGroupGetter],
};

const addTeacherToInternalGroupHandler = {
  provide: AddTeacherToInternalGroupHandler,
  useFactory: (
    repository: InternalGroupRepository,
    internalGroupGetter: InternalGroupGetter,
    edaeUserGetter: EdaeUserGetter,
    eventDispatcher: EventDispatcher,
  ): AddTeacherToInternalGroupHandler =>
    new AddTeacherToInternalGroupHandler(
      repository,
      internalGroupGetter,
      edaeUserGetter,
      eventDispatcher,
    ),
  inject: [
    InternalGroupRepository,
    InternalGroupGetter,
    EdaeUserGetter,
    EventDispatcher,
  ],
};

const removeTeacherFromInternalGroupHandler = {
  provide: RemoveTeacherFromInternalGroupHandler,
  useFactory: (
    repository: InternalGroupRepository,
    internalGroupGetter: InternalGroupGetter,
    edaeUserGetter: EdaeUserGetter,
  ): RemoveTeacherFromInternalGroupHandler =>
    new RemoveTeacherFromInternalGroupHandler(
      repository,
      internalGroupGetter,
      edaeUserGetter,
    ),
  inject: [InternalGroupRepository, InternalGroupGetter, EdaeUserGetter],
};

const editInternalGroupHandler = {
  provide: EditInternalGroupHandler,
  useFactory: (
    repository: InternalGroupRepository,
    internalGroupGetter: InternalGroupGetter,
  ): EditInternalGroupHandler =>
    new EditInternalGroupHandler(repository, internalGroupGetter),
  inject: [InternalGroupRepository, InternalGroupGetter],
};

const getCoursingSubjectStudentsHandler = {
  provide: GetCoursingSubjectStudentsHandler,
  useFactory: (
    subjectGetter: SubjectGetter,
    enrollmentGetter: EnrollmentGetter,
  ): GetCoursingSubjectStudentsHandler =>
    new GetCoursingSubjectStudentsHandler(subjectGetter, enrollmentGetter),
  inject: [SubjectGetter, EnrollmentGetter],
};

const addStudentToInternalGroupHandler = {
  provide: AddStudentToInternalGroupHandler,
  useFactory: (
    repository: InternalGroupRepository,
    internalGroupGetter: InternalGroupGetter,
    studentGetter: StudentGetter,
    eventDispatcher: EventDispatcher,
  ): AddStudentToInternalGroupHandler =>
    new AddStudentToInternalGroupHandler(
      repository,
      internalGroupGetter,
      studentGetter,
      eventDispatcher,
    ),
  inject: [
    InternalGroupRepository,
    InternalGroupGetter,
    StudentGetter,
    EventDispatcher,
  ],
};

const getInternalGroupStudentsHandler = {
  provide: GetInternalGroupStudentsHandler,
  useFactory: (
    repository: StudentRepository,
    internalGroupGetter: InternalGroupGetter,
    enrollmentGetter: EnrollmentGetter,
  ): GetInternalGroupStudentsHandler =>
    new GetInternalGroupStudentsHandler(
      repository,
      internalGroupGetter,
      enrollmentGetter,
    ),
  inject: [StudentRepository, InternalGroupGetter, EnrollmentGetter],
};

const removeStudentFromInternalGroupHandler = {
  provide: RemoveStudentFromInternalGroupHandler,
  useFactory: (
    repository: InternalGroupRepository,
    internalGroupGetter: InternalGroupGetter,
    studentGetter: StudentGetter,
  ): RemoveStudentFromInternalGroupHandler =>
    new RemoveStudentFromInternalGroupHandler(
      repository,
      internalGroupGetter,
      studentGetter,
    ),
  inject: [InternalGroupRepository, InternalGroupGetter, StudentGetter],
};

const createAdministrativeProcessHandler = {
  provide: CreateAdministrativeProcessHandler,
  useFactory: (
    administrativeProcessRepository: AdministrativeProcessRepository,
    academicRecordGetter: AcademicRecordGetter,
    studentGetter: StudentGetter,
  ): CreateAdministrativeProcessHandler =>
    new CreateAdministrativeProcessHandler(
      administrativeProcessRepository,
      academicRecordGetter,
      studentGetter,
    ),
  inject: [
    AdministrativeProcessRepository,
    AcademicRecordGetter,
    StudentGetter,
  ],
};

const getAllAdministrativeProcessHandler = {
  provide: GetAllAdministrativeProcessesHandler,
  useFactory: (
    administrativeProcessRepository: AdministrativeProcessRepository,
  ): GetAllAdministrativeProcessesHandler =>
    new GetAllAdministrativeProcessesHandler(administrativeProcessRepository),
  inject: [AdministrativeProcessRepository],
};

const searchAdministrativeProcessHandler = {
  provide: SearchAdministrativeProcessesHandler,
  useFactory: (
    administrativeProcessRepository: AdministrativeProcessRepository,
  ): SearchAdministrativeProcessesHandler =>
    new SearchAdministrativeProcessesHandler(administrativeProcessRepository),
  inject: [AdministrativeProcessRepository],
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
  getAllStudentsByAdministrativeGroupHandler,
  searchStudentsByAdministrativeGroupHandler,
  getInternalGroupDetailHandler,
  addTeacherToInternalGroupHandler,
  removeTeacherFromInternalGroupHandler,
  editInternalGroupHandler,
  getCoursingSubjectStudentsHandler,
  addStudentToInternalGroupHandler,
  getInternalGroupStudentsHandler,
  removeStudentFromInternalGroupHandler,
  createAdministrativeProcessHandler,
  getAllAdministrativeProcessHandler,
  searchAdministrativeProcessHandler,
];
