import { CreateRefreshTokenHandler } from '#/student/student/application/create-refresh-token/create-refresh-token.handler';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';

const createRefreshTokenHandler = {
  provide: CreateRefreshTokenHandler,
  useFactory: (
    studentGetter: StudentGetter,
    codeRepository: StudentRefreshTokenRepository,
  ): CreateRefreshTokenHandler =>
    new CreateRefreshTokenHandler(studentGetter, codeRepository),
  inject: [StudentGetter, StudentRefreshTokenRepository],
};

export const handlers = [createRefreshTokenHandler];
