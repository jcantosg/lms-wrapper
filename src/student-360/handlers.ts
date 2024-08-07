import { CreateRefreshTokenHandler } from '#student-360/student/application/create-refresh-token/create-refresh-token.handler';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRefreshTokenRepository } from '#student-360/student/domain/repository/student-refresh-token.repository';
import { GenerateRecoveryPasswordTokenHandler } from '#student-360/student/application/generate-recovery-password-token/generate-recovery-password-token.handler';
import { StudentRecoveryPasswordTokenRepository } from '#student-360/student/domain/repository/student-recovery-password-token.repository';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { UpdateStudentPasswordHandler } from '#student-360/student/application/update-password/update-password.handler';
import { StudentRecoveryPasswordTokenGetter } from '#student-360/student/domain/service/student-recovery-password-token-getter.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { ConfigService } from '@nestjs/config';
import { ExpireStudentRefreshTokenHandler } from '#student-360/student/application/expire-refresh-token/expire-student-refresh-token.handler';
import { studentAcademicRecordHandlers } from '#student-360/academic-offering/academic-record/handlers';
import { studentSubjectHandlers } from '#student-360/academic-offering/subject/handlers';
import { chatHandlers } from '#student-360/chat/handlers';
import { UpdateProfileHandler } from '#student-360/student/application/update-profile/update-profile.handler';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { EditStudentHandler } from '#student/application/edit-student/edit-student.handler';
import { qualificationHandlers } from '#student-360/academic-offering/qualification/handlers';

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

const expireStudentRefreshTokenHandler = {
  provide: ExpireStudentRefreshTokenHandler,
  useFactory: (
    studentGetter: StudentGetter,
    refreshTokenRepository: StudentRefreshTokenRepository,
  ): ExpireStudentRefreshTokenHandler =>
    new ExpireStudentRefreshTokenHandler(studentGetter, refreshTokenRepository),
  inject: [StudentGetter, StudentRefreshTokenRepository],
};

const updateProfileHandler = {
  provide: UpdateProfileHandler,
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

export const handlers = [
  createRefreshTokenHandler,
  generateRecoveryPasswordTokenHandler,
  updateStudentPasswordHandler,
  expireStudentRefreshTokenHandler,
  ...studentAcademicRecordHandlers,
  ...studentSubjectHandlers,
  ...chatHandlers,
  ...qualificationHandlers,
  updateProfileHandler,
];
