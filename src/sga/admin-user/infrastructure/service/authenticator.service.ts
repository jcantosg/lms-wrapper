import { UserRequest } from '#shared/infrastructure/http/request';
import { JwtTokenGenerator } from './jwt-token-generator.service';
import { RefreshTokenGenerator } from './refresh-token-generator.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Authenticator {
  constructor(
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly refreshTokenTTL: number,
  ) {}

  async login(
    user: UserRequest,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return {
      accessToken: this.jwtTokenGenerator.generateToken(
        user.id,
        user.email,
        user.roles,
      ),
      refreshToken: await this.refreshTokenGenerator.generateRefreshToken(
        user.id,
        this.refreshTokenTTL,
      ),
    };
  }
}
