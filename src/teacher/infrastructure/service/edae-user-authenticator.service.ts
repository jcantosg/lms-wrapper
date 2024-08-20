import { Injectable } from '@nestjs/common';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserRefreshTokenGenerator } from '#/teacher/infrastructure/service/edae-user-refresh-token-generator.service';
import { ChatRepository } from '#shared/domain/repository/chat-repository';

@Injectable()
export class Authenticator {
  constructor(
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly refreshTokenGenerator: EdaeUserRefreshTokenGenerator,
    private readonly refreshTokenTTL: number,
    private readonly chatRepository: ChatRepository,
  ) {}

  async login(user: EdaeUser): Promise<{
    accessToken: string;
    refreshToken: string;
    fbToken: string | null;
  }> {
    const fbToken = await this.chatRepository.createToken(user.email, user.id);

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
