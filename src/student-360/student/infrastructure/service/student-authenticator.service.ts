import { Injectable } from '@nestjs/common';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';

import { Student } from '#shared/domain/entity/student.entity';
import { RefreshTokenGenerator } from '#/student-360/student/infrastructure/service/refresh-token-generator.service';
import { ChatRepository } from '#shared/domain/repository/chat-repository';

@Injectable()
export class Authenticator {
  constructor(
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly refreshTokenTTL: number,
    private readonly chatRepository: ChatRepository,
  ) {}

  async login(user: Student): Promise<{
    accessToken: string;
    refreshToken: string;
    fbToken: string | null;
  }> {
    const fbToken = await this.chatRepository.createToken(
      user.universaeEmail,
      user.id,
    );

    return {
      accessToken: this.jwtTokenGenerator.generateToken(user.id, user.email),
      refreshToken: await this.refreshTokenGenerator.generateRefreshToken(
        user.id,
        this.refreshTokenTTL,
      ),
      fbToken,
    };
  }
}
