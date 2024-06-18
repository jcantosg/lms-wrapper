import { CreateRefreshTokenHandler } from '#/student/student/application/create-refresh-token/create-refresh-token.handler';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';
import { GenerateRecoveryPasswordTokenHandler } from '#/student/student/application/generate-recovery-password-token/generate-recovery-password-token.handler';
import { StudentRecoveryPasswordTokenRepository } from '#/student/student/domain/repository/student-recovery-password-token.repository';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { UpdateStudentPasswordHandler } from '#/student/student/application/update-password/update-password.handler';
import { StudentRecoveryPasswordTokenGetter } from '#/student/student/domain/service/student-recovery-password-token-getter.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { ConfigService } from '@nestjs/config';
import { GetStudentAcademicRecordsHandler } from '#/student/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { GetStudentAcademicRecordHandler } from '#/student/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.handler';
import { ExpireStudentRefreshTokenHandler } from '#/student/student/application/expire-refresh-token/expire-student-refresh-token.handler';

const createRefreshTokenHandler = {
  provide: CreateRefreshTokenHandler,
  useFactory: (
    studentGetter: StudentGetter,
    codeRepository: StudentRefreshTokenRepository,
  ): CreateRefreshTokenHandler =>
    new CreateRefreshTokenHandler(studentGetter, codeRepository),
  inject: [StudentGetter, StudentRefreshTokenRepository],
};

const generateRecoveryPasswordTokenHandler = {
  provide: GenerateRecoveryPasswordTokenHandler,
  useFactory: (
    repository: StudentRepository,
    recoveryPasswordTokenRepository: StudentRecoveryPasswordTokenRepository,
    jwtTokenGenerator: JwtTokenGenerator,
    eventDispatcher: EventDispatcher,
    configService: ConfigService,
  ) =>
    new GenerateRecoveryPasswordTokenHandler(
      repository,
      recoveryPasswordTokenRepository,
      jwtTokenGenerator,
      configService.getOrThrow<number>('STUDENT_RECOVERY_PASSWORD_TTL'),
      eventDispatcher,
    ),

  inject: [
    StudentRepository,
    StudentRecoveryPasswordTokenRepository,
    JwtTokenGenerator,
    EventDispatcher,
    ConfigService,
  ],
};

const updateStudentPasswordHandler = {
  provide: UpdateStudentPasswordHandler,
  useFactory: (
    studentGetter: StudentGetter,
    studentRepository: StudentRepository,
    recoveryPasswordTokenRepository: StudentRecoveryPasswordTokenRepository,
    recoveryPasswordTokenGetter: StudentRecoveryPasswordTokenGetter,
    jwtService: JwtService,
    passwordEncoder: PasswordEncoder,
  ) =>
    new UpdateStudentPasswordHandler(
      studentGetter,
      studentRepository,
      recoveryPasswordTokenRepository,
      recoveryPasswordTokenGetter,
      jwtService,
      passwordEncoder,
    ),
  inject: [
    StudentGetter,
    StudentRepository,
    StudentRecoveryPasswordTokenRepository,
    StudentRecoveryPasswordTokenGetter,
    JwtService,
    PasswordEncoder,
  ],
};

const getStudentAcademicRecordsHandler = {
  provide: GetStudentAcademicRecordsHandler,
  useFactory: (
    repository: AcademicRecordRepository,
  ): GetStudentAcademicRecordsHandler =>
    new GetStudentAcademicRecordsHandler(repository),
  inject: [AcademicRecordRepository],
};

const getAcademicRecordHandler = {
  provide: GetStudentAcademicRecordHandler,
  useFactory: (
    academicRecordGetter: AcademicRecordGetter,
  ): GetStudentAcademicRecordHandler =>
    new GetStudentAcademicRecordHandler(academicRecordGetter),
  inject: [AcademicRecordGetter],
};

const expireStudentRefreshTokenHandler = {
  provide: ExpireStudentRefreshTokenHandler,
  useFactory: (
    studentGetter: StudentGetter,
    refreshTokenRepository: StudentRefreshTokenRepository,
  ): ExpireStudentRefreshTokenHandler =>
    new ExpireStudentRefreshTokenHandler(studentGetter, refreshTokenRepository),
  inject: [StudentGetter, StudentRefreshTokenRepository],
};

export const handlers = [
  createRefreshTokenHandler,
  generateRecoveryPasswordTokenHandler,
  updateStudentPasswordHandler,
  getStudentAcademicRecordsHandler,
  getAcademicRecordHandler,
  expireStudentRefreshTokenHandler,
];
