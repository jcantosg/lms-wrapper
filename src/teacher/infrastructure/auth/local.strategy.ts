import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserCredentialsChecker } from '#/teacher/infrastructure/service/edae-user-credentials-checker.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'edae') {
  constructor(private readonly credentialsChecker: EdaeUserCredentialsChecker) {
    super();
  }

  async validate(username: string, password: string): Promise<EdaeUser> {
    const edaeUser = await this.credentialsChecker.checkCredentials(
      username,
      password,
    );

    if (!edaeUser) {
      throw new UnauthorizedException();
    }

    return edaeUser;
  }
}
