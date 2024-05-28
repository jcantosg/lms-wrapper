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
  ) =>
    new GenerateRecoveryPasswordTokenHandler(
      repository,
      recoveryPasswordTokenRepository,
      jwtTokenGenerator,
      49,
      eventDispatcher,
    ),

  inject: [
    StudentRepository,
    StudentRecoveryPasswordTokenRepository,
    JwtTokenGenerator,
    EventDispatcher,
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

export const handlers = [
  createRefreshTokenHandler,
  generateRecoveryPasswordTokenHandler,
  updateStudentPasswordHandler,
];
