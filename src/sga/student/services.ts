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
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/create-lms-student/create-lms-student.handler';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/delete-lms-student/delete-lms-student.handler';
import { CreateStudentFromCRMTransactionalService } from '#student/domain/service/create-student-from-crm.transactional-service';
import { CreateStudentFromCRMTypeormTransactionalService } from '#student/infrastructure/service/create-student-from-crm.typeorm-transactional-service';
import { AdministrativeGroupStatusStudentGetter } from '#student/domain/service/administrative-group-status-student.getter.service';
import { SubjectUpToBlockGetter } from '#academic-offering/domain/service/subject/subject-up-to-block-getter.service';
import { ConfigService } from '@nestjs/config';
import { TransferAcademicRecordTypeormTransactionalService } from '#student/infrastructure/service/transfer-academic-record.typeorm-transactional-service';

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
  useFactory: (): TransferAcademicRecordTypeormTransactionalService =>
    new TransferAcademicRecordTypeormTransactionalService(datasource),
  inject: [],
};

const createStudentFromSGATransactionService = {
  provide: CreateStudentFromSGATransactionService,
  useFactory: (
    createLmsStudentHandler: CreateLmsStudentHandler,
    deleteLmsStudentHandler: DeleteLmsStudentHandler,
    passwordEncoder: PasswordEncoder,
    configService: ConfigService,
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
    );
  },
  inject: [
    CreateLmsStudentHandler,
    DeleteLmsStudentHandler,
    PasswordEncoder,
    ConfigService,
  ],
};

const createStudentFromCRMTransactionalService = {
  provide: CreateStudentFromCRMTransactionalService,
  useFactory: (
    createLmsStudentHandler: CreateLmsStudentHandler,
    deleteLmsStudentHandler: DeleteLmsStudentHandler,
    passwordEncoder: PasswordEncoder,
    configService: ConfigService,
  ): CreateStudentFromCRMTypeormTransactionalService => {
    const defaultPassword = configService.get<string>(
      'DEFAULT_LMS_PASSWORD',
      'Defaultpassword-1234',
    );

    return new CreateStudentFromCRMTypeormTransactionalService(
      datasource,
      createLmsStudentHandler,
      deleteLmsStudentHandler,
      passwordEncoder,
      defaultPassword,
    );
  },
  inject: [
    CreateLmsStudentHandler,
    DeleteLmsStudentHandler,
    PasswordEncoder,
    ConfigService,
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
];
