import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import semver from 'semver';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '#shared/domain/exception/bad-request.exception';

@Injectable()
export class VersionHeaderMiddleware implements NestMiddleware {
  private readonly headerName = 'X-App-Version';
  private readonly currentVersion;

  constructor(configService: ConfigService) {
    this.currentVersion =
      configService.getOrThrow<string>('APP_STABLE_VERSION');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const appVersion: string | undefined = req.header(this.headerName);

    if (!appVersion) {
      next();

      return;
    }

    if (
      !semver.valid(appVersion) ||
      !semver.gte(appVersion, this.currentVersion)
    ) {
      throw new BadRequestException('universae.upgrade_needed');
    }

    next();
  }
}
