import { CreateEdaeUserRefreshTokenHandler } from '#/teacher/application/edae-user/create-edae-user-refresh-token/create-edae-user-refresh-token.handler';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';
import { ExpireEdaeUserRefreshTokenHandler } from '#/teacher/application/edae-user/expire-edae-user-refresh-token/expire-edae-user-refresh-token.handler';

const createEdaeUserRefreshTokenHandler = {
  provide: CreateEdaeUserRefreshTokenHandler,
  useFactory: (
    edaeUserGetter: EdaeUserGetter,
    repository: EdaeUserRefreshTokenRepository,
  ): CreateEdaeUserRefreshTokenHandler =>
    new CreateEdaeUserRefreshTokenHandler(edaeUserGetter, repository),
  inject: [EdaeUserGetter, EdaeUserRefreshTokenRepository],
};

const expireEdaeUserRefreshTokenHandler = {
  provide: ExpireEdaeUserRefreshTokenHandler,
  useFactory: (
    edaeUserGetter: EdaeUserGetter,
    repository: EdaeUserRefreshTokenRepository,
  ): ExpireEdaeUserRefreshTokenHandler =>
    new ExpireEdaeUserRefreshTokenHandler(edaeUserGetter, repository),
  inject: [EdaeUserGetter, EdaeUserRefreshTokenRepository],
};

export const handlers = [
  createEdaeUserRefreshTokenHandler,
  expireEdaeUserRefreshTokenHandler,
];
