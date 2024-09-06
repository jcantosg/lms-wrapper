import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { EnrollmentCreator } from '#student/domain/service/enrollment-creator.service';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { TransferAcademicRecordTransactionalService } from '#student/domain/service/transfer-academic-record.transactional-service';
import datasource from '#config/ormconfig';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { CreateStudentFromSGATransactionService } from '#student/domain/service/create-student-from-SGA.transactional-service';
import { CreateStudentFromSGATyperomTransactionService } from '#student/infrastructure/service/create-student-from-SGA-typeorm-transaction.service';
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.handler';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/lms-student/delete-lms-student/delete-lms-student.handler';
import { CreateStudentFromCRMTransactionalService } from '#student/domain/service/create-student-from-crm.transactional-service';
import { CreateStudentFromCRMTypeormTransactionalService } from '#student/infrastructure/service/create-student-from-crm.typeorm-transactional-service';
import { AdministrativeGroupStatusStudentGetter } from '#student/domain/service/administrative-group-status-student.getter.service';
import { SubjectUpToBlockGetter } from '#academic-offering/domain/service/subject/subject-up-to-block-getter.service';
import { ConfigService } from '@nestjs/config';
import { TransferAcademicRecordTypeormTransactionalService } from '#student/infrastructure/service/transfer-academic-record.typeorm-transactional-service';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { StudentAdministrativeGroupByAcademicRecordGetter } from '#student/domain/service/student-administrative-group-by-academic-record.getter.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { InternalGroupDefaultTeacherGetter } from '#student/domain/service/internal-group-default-teacher-getter.service';
import { UpdateInternalGroupsService } from '#student/domain/service/update-internal-groups.service';
import { CreateLmsEnrollmentHandler } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.handler';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { GetLmsStudentHandler } from '#lms-wrapper/application/lms-student/get-lms-student/get-lms-student.handler';
import { UpdateAdministrativeGroupsService } from '#student/domain/service/update-administrative-groups.service';
import { CancelAcademicRecordTransactionalService } from '#student/domain/service/cancel-academic-record.transactional-service';
import { CancelAcademicRecordTypeormTransactionalService } from '#student/infrastructure/service/cancel-academic-record.typeorm-transactional-service';
import { MoveStudentFromAdministrativeGroupTransactionalService } from '#student/domain/service/move-student-from-administrative-group.transactional.service';
import { MoveStudentFromAdministrativeGroupTypeormTransactionalService } from '#student/infrastructure/service/move-student-from-administrative-group.typeorm-transactional-service';

const academicRecordGetter = {
  provide: AcademicRecordGetter,
  useFactory: (repository: AcademicRecordRepository): AcademicRecordGetter =>
    new AcademicRecordGetter(repository),
  inject: [AcademicRecordRepository],
};
const enrollmentGetter = {
  provide: EnrollmentGetter,
  useFactory: (repository: EnrollmentRepository): EnrollmentGetter =>
    new EnrollmentGetter(repository),
  inject: [EnrollmentRepository],
};
const administrativeGroupGetter = {
  provide: AdministrativeGroupGetter,
  useFactory: (
    repository: AdministrativeGroupRepository,
  ): AdministrativeGroupGetter => new AdministrativeGroupGetter(repository),
  inject: [AdministrativeGroupRepository],
};
const subjectCallGetter = {
  provide: SubjectCallGetter,
  useFactory: (repository: SubjectCallRepository): SubjectCallGetter =>
    new SubjectCallGetter(repository),
  inject: [SubjectCallRepository],
};
const enrollmentCreator = {
  provide: EnrollmentCreator,
  useFactory: (
    repository: SubjectRepository,
    uuidGenerator: UUIDGeneratorService,
  ): EnrollmentCreator => new EnrollmentCreator(repository, uuidGenerator),
  inject: [SubjectRepository, UUIDGeneratorService],
};

const transferAcademicRecordTransactionalService = {
  provide: TransferAcademicRecordTransactionalService,
  useFactory: (
    createLmsEnrollmentHandler: CreateLmsEnrollmentHandler,
    deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler,
  ): TransferAcademicRecordTypeormTransactionalService =>
    new TransferAcademicRecordTypeormTransactionalService(
      datasource,
      createLmsEnrollmentHandler,
      deleteLmsEnrollmentHandler,
    ),
  inject: [CreateLmsEnrollmentHandler, DeleteLmsEnrollmentHandler],
};

const createStudentFromSGATransactionService = {
  provide: CreateStudentFromSGATransactionService,
  useFactory: (
    createLmsStudentHandler: CreateLmsStudentHandler,
    deleteLmsStudentHandler: DeleteLmsStudentHandler,
    passwordEncoder: PasswordEncoder,
    configService: ConfigService,
    getLmsStudentHandler: GetLmsStudentHandler,
  ): CreateStudentFromSGATyperomTransactionService => {
    const defaultPassword = configService.get<string>(
      'DEFAULT_LMS_PASSWORD',
      'Defaultpassword-1234',
    );

    return new CreateStudentFromSGATyperomTransactionService(
      datasource,
      createLmsStudentHandler,
      deleteLmsStudentHandler,
      passwordEncoder,
      defaultPassword,
      getLmsStudentHandler,
    );
  },
  inject: [
    CreateLmsStudentHandler,
    DeleteLmsStudentHandler,
    PasswordEncoder,
    ConfigService,
    GetLmsStudentHandler,
  ],
};

const createStudentFromCRMTransactionalService = {
  provide: CreateStudentFromCRMTransactionalService,
  useFactory: (
    createLmsStudentHandler: CreateLmsStudentHandler,
    deleteLmsStudentHandler: DeleteLmsStudentHandler,
    passwordEncoder: PasswordEncoder,
    configService: ConfigService,
    createLmsEnrollmentHandler: CreateLmsEnrollmentHandler,
    deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler,
    getLmsStudentHandler: GetLmsStudentHandler,
  ): CreateStudentFromCRMTypeormTransactionalService => {
    const defaultPassword = configService.get<string>(
      'DEFAULT_LMS_PASSWORD',
      'Defaultpassword-1234',
    );

    return new CreateStudentFromCRMTypeormTransactionalService(
      datasource,
      createLmsStudentHandler,
      deleteLmsStudentHandler,
      createLmsEnrollmentHandler,
      deleteLmsEnrollmentHandler,
      passwordEncoder,
      defaultPassword,
      getLmsStudentHandler,
    );
  },
  inject: [
    CreateLmsStudentHandler,
    DeleteLmsStudentHandler,
    PasswordEncoder,
    ConfigService,
    CreateLmsEnrollmentHandler,
    DeleteLmsEnrollmentHandler,
    GetLmsStudentHandler,
  ],
};

const enrollmentCreatorService = {
  provide: EnrollmentCreator,
  useFactory: (
    subjectRepository: SubjectRepository,
    uuidGenerator: UUIDGeneratorService,
  ): EnrollmentCreator =>
    new EnrollmentCreator(subjectRepository, uuidGenerator),
  inject: [SubjectRepository, UUIDGeneratorService],
};

const administrativeGroupStatusStudentGetterService = {
  provide: AdministrativeGroupStatusStudentGetter,
  useFactory: (
    enrollmentRepository: EnrollmentRepository,
    subjectUpToBlockGetter: SubjectUpToBlockGetter,
  ): AdministrativeGroupStatusStudentGetter =>
    new AdministrativeGroupStatusStudentGetter(
      enrollmentRepository,
      subjectUpToBlockGetter,
    ),
  inject: [EnrollmentRepository, SubjectUpToBlockGetter],
};

const internalGroupGetter = {
  provide: InternalGroupGetter,
  useFactory: (repository: InternalGroupRepository): InternalGroupGetter =>
    new InternalGroupGetter(repository),
  inject: [InternalGroupRepository],
};

const internalGroupDefaulTeacherGetter = {
  provide: InternalGroupDefaultTeacherGetter,
  useFactory: (
    repository: InternalGroupRepository,
  ): InternalGroupDefaultTeacherGetter =>
    new InternalGroupDefaultTeacherGetter(repository),
  inject: [InternalGroupRepository],
};

const studentAdministrativeGroupByAcademicRecordGetter = {
  provide: StudentAdministrativeGroupByAcademicRecordGetter,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
    studentGetter: StudentGetter,
    administrativeGroupRepository: AdministrativeGroupRepository,
  ): StudentAdministrativeGroupByAcademicRecordGetter =>
    new StudentAdministrativeGroupByAcademicRecordGetter(
      academicRecordGetter,
      studentGetter,
      administrativeGroupRepository,
    ),
  inject: [AcademicRecordGetter, StudentGetter, AdministrativeGroupRepository],
};

const updateInternalGroupsService = {
  provide: UpdateInternalGroupsService,
  useFactory: (
    repository: InternalGroupRepository,
  ): UpdateInternalGroupsService => new UpdateInternalGroupsService(repository),
  inject: [InternalGroupRepository],
};

const updateAdministrativeGroupsService = {
  provide: UpdateAdministrativeGroupsService,
  useFactory: (
    repository: AdministrativeGroupRepository,
  ): UpdateAdministrativeGroupsService =>
    new UpdateAdministrativeGroupsService(repository),
  inject: [AdministrativeGroupRepository],
};

const cancelAcademicRecordTransactionalService = {
  provide: CancelAcademicRecordTransactionalService,
  useFactory: (
    createLmsEnrollmentHandler: CreateLmsEnrollmentHandler,
    deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler,
  ): CancelAcademicRecordTypeormTransactionalService =>
    new CancelAcademicRecordTypeormTransactionalService(
      datasource,
      createLmsEnrollmentHandler,
      deleteLmsEnrollmentHandler,
    ),
  inject: [CreateLmsEnrollmentHandler, DeleteLmsEnrollmentHandler],
};

const moveStudentsFromAdministrativeGroupTransactionalService = {
  provide: MoveStudentFromAdministrativeGroupTransactionalService,
  useFactory: (): MoveStudentFromAdministrativeGroupTransactionalService =>
    new MoveStudentFromAdministrativeGroupTypeormTransactionalService(
      datasource,
    ),
};

export const services = [
  academicRecordGetter,
  enrollmentGetter,
  administrativeGroupGetter,
  subjectCallGetter,
  enrollmentCreator,
  transferAcademicRecordTransactionalService,
  createStudentFromSGATransactionService,
  createStudentFromCRMTransactionalService,
  enrollmentCreatorService,
  administrativeGroupStatusStudentGetterService,
  internalGroupGetter,
  studentAdministrativeGroupByAcademicRecordGetter,
  internalGroupDefaulTeacherGetter,
  updateInternalGroupsService,
  updateAdministrativeGroupsService,
  cancelAcademicRecordTransactionalService,
  moveStudentsFromAdministrativeGroupTransactionalService,
];
