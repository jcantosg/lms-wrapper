import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { TokenMalformedException } from '#shared/domain/exception/token-malformed.exception';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { StudentRepository } from '#/student-360/student/domain/repository/student.repository';
import { StudentRefreshTokenRepository } from '#/student-360/student/domain/repository/student-refresh-token.repository';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentRefreshToken } from '#/student-360/student/domain/entity/refresh-token.entity';
import { StudentTokenExpiredException } from '#/student-360/student/domain/exception/student-token-expired.exception';
import { StudentRefreshTokenNotFoundException } from '#/student-360/student/domain/exception/student-refresh-token-not-found.exception';
import { StudentRefreshTokenRevokedException } from '#/student-360/student/domain/exception/student-refresh-token-revoked.exception';

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

@Injectable()
export class StudentAccessTokenRefresher {
  private logger: Logger;

  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly tokenRepository: StudentRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly jwtTokenGenerator: JwtTokenGenerator,
  ) {
    this.logger = new Logger(StudentAccessTokenRefresher.name);
  }

  public async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { student } = await this.resolveRefreshToken(refreshToken);
    const token = this.jwtTokenGenerator.generateToken(
      student.id,
      student.email,
    );

    return {
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

  private async resolveRefreshToken(
    encoded: string,
  ): Promise<{ student: Student; token: StudentRefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new StudentRefreshTokenNotFoundException();
    }

    if (token.isRevoked) {
      throw new StudentRefreshTokenRevokedException();
    }

    const student = await this.getUserFromRefreshTokenPayload(payload);

    if (!student) {
      throw new TokenMalformedException();
    }

    return { student, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      this.logger.error(e.message, e.stack);

      if (e instanceof TokenExpiredError) {
        throw new StudentTokenExpiredException();
      } else {
        throw new TokenMalformedException();
      }
    }
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<StudentRefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new TokenMalformedException();
    }

    return this.tokenRepository.get(tokenId);
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<Student> {
    const subId = payload.sub;

    if (!subId) {
      throw new TokenMalformedException();
    }

    const student = await this.studentRepository.get(subId);

    if (!student) {
      throw new AdminUserNotFoundException();
    }

    return student;
  }
}