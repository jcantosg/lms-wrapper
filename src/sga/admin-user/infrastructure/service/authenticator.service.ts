import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
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
    user: AdminUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return {
      accessToken: this.jwtTokenGenerator.generateToken(user.id, user.email),
      refreshToken: await this.refreshTokenGenerator.generateRefreshToken(
        user.id,
        this.refreshTokenTTL,
      ),
    };
  }
}
