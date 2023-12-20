import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentHeaderMiddleware implements NestMiddleware {
  private readonly headerName = 'X-API-Environment';
  private readonly environment;

  constructor(configService: ConfigService) {
    this.environment = configService.get<string>('NODE_ENV');
  }

  use(req: Request, res: Response, next: NextFunction) {
    if ('production' !== this.environment) {
      res.set(this.headerName, this.environment);
    }
    next();
  }
}
