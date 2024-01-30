import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { RefreshToken } from '#admin-user/domain/entity/refresh-token.entity';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { JwtTokenGenerator } from '#admin-user/infrastructure/service/jwt-token-generator.service';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { RefreshTokenNotFoundException } from '#shared/domain/exception/admin-user/refresh-token-not-found.exception';
import { RefreshTokenRevokedException } from '#shared/domain/exception/admin-user/refresh-token-revoked.exception';
import { TokenExpiredException } from '#shared/domain/exception/token-expired.exception';
import { TokenMalformedException } from '#shared/domain/exception/token-malformed.exception';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

@Injectable()
export class AccessTokenRefresherService {
  private logger: Logger;
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly tokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly jwtTokenGenerator: JwtTokenGenerator,
  ) {
    this.logger = new Logger(AccessTokenRefresherService.name);
  }

  public async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { adminUser } = await this.resolveRefreshToken(refreshToken);
    const token = this.jwtTokenGenerator.generateToken(
      adminUser.id,
      adminUser.email,
    );

    return {
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

  private async resolveRefreshToken(
    encoded: string,
  ): Promise<{ adminUser: AdminUser; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new RefreshTokenNotFoundException();
    }

    if (token.isRevoked) {
      throw new RefreshTokenRevokedException();
    }

    const adminUser = await this.getUserFromRefreshTokenPayload(payload);

    if (!adminUser) {
      throw new TokenMalformedException();
    }

    return { adminUser, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      this.logger.error(e.message, e.stack);

      if (e instanceof TokenExpiredError) {
        throw new TokenExpiredException();
      } else {
        throw new TokenMalformedException();
      }
    }
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new TokenMalformedException();
    }

    return this.tokenRepository.get(tokenId);
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<AdminUser> {
    const subId = payload.sub;

    if (!subId) {
      throw new TokenMalformedException();
    }

    const adminUser = await this.adminUserRepository.get(subId);

    if (!adminUser) {
      throw new AdminUserNotFoundException();
    }

    return adminUser;
  }
}
