import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { TokenMalformedException } from '#shared/domain/exception/token-malformed.exception';
import { Injectable, Logger } from '@nestjs/common';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserRefreshToken } from '#/teacher/domain/entity/edae-user-refresh-token.entity';
import { EdaeUserRefreshTokenNotFoundException } from '#/teacher/domain/exception/edae-user-refresh-token-not-found.exception';
import { EdaeUserRefreshTokenRevokedException } from '#/teacher/domain/exception/edae-user-refresh-token-revoked.exception';
import { EdaeUserTokenExpiredException } from '#/teacher/domain/exception/edae-user-token-expired.exception';
import { ChatRepository } from '#shared/domain/repository/chat-repository';

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

@Injectable()
export class EdaeUserAccessTokenRefresher {
  private logger: Logger;

  constructor(
    private readonly edaeUserRepository: EdaeUserRepository,
    private readonly tokenRepository: EdaeUserRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly chatRepository: ChatRepository,
  ) {
    this.logger = new Logger(EdaeUserAccessTokenRefresher.name);
  }

  public async refresh(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    fbToken: string | null;
  }> {
    const { edaeUser } = await this.resolveRefreshToken(refreshToken);
    const token = this.jwtTokenGenerator.generateToken(
      edaeUser.id,
      edaeUser.email,
    );

    const fbToken = await this.chatRepository.createToken(
      edaeUser.email,
      edaeUser.id,
    );

    return {
      accessToken: token,
      refreshToken: refreshToken,
      fbToken,
    };
  }

  private async resolveRefreshToken(
    encoded: string,
  ): Promise<{ edaeUser: EdaeUser; token: EdaeUserRefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new EdaeUserRefreshTokenNotFoundException();
    }

    if (token.isRevoked) {
      throw new EdaeUserRefreshTokenRevokedException();
    }

    const edaeUser = await this.getUserFromRefreshTokenPayload(payload);

    if (!edaeUser) {
      throw new TokenMalformedException();
    }

    return { edaeUser, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      this.logger.error(e.message, e.stack);

      if (e instanceof TokenExpiredError) {
        throw new EdaeUserTokenExpiredException();
      } else {
        throw new TokenMalformedException();
      }
    }
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<EdaeUserRefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new TokenMalformedException();
    }

    return this.tokenRepository.get(tokenId);
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<EdaeUser> {
    const subId = payload.sub;

    if (!subId) {
      throw new TokenMalformedException();
    }

    const student = await this.edaeUserRepository.get(subId);

    if (!student) {
      throw new AdminUserNotFoundException();
    }

    return student;
  }
}
