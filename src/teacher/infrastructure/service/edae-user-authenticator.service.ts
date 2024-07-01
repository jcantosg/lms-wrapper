import { Injectable } from '@nestjs/common';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserRefreshTokenGenerator } from '#/teacher/infrastructure/service/edae-user-refresh-token-generator.service';

@Injectable()
export class Authenticator {
  constructor(
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly refreshTokenGenerator: EdaeUserRefreshTokenGenerator,
    private readonly refreshTokenTTL: number,
  ) {}

  async login(
    user: EdaeUser,
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
