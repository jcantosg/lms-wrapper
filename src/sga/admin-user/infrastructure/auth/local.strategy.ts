import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialsChecker } from '../service/credentials-checker.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly credentialsChecker: CredentialsChecker) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const adminUser = await this.credentialsChecker.checkCredentials(
      username,
      password,
    );

    if (!adminUser) {
      throw new UnauthorizedException();
    }

    return adminUser;
  }
}
