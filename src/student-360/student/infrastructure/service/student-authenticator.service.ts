import { Injectable } from '@nestjs/common';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';

import { Student } from '#shared/domain/entity/student.entity';
import { RefreshTokenGenerator } from '#/student-360/student/infrastructure/service/refresh-token-generator.service';

@Injectable()
export class Authenticator {
  constructor(
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly refreshTokenTTL: number,
  ) {}

  async login(
    user: Student,
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
