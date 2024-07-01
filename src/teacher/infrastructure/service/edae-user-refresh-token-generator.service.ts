import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { CreateEdaeUserRefreshTokenHandler } from '#/teacher/application/edae-user/create-edae-user-refresh-token/create-edae-user-refresh-token.handler';
import { CreateEdaeUserRefreshTokenCommand } from '#/teacher/application/edae-user/create-edae-user-refresh-token/create-edae-user-refresh-token.command';

@Injectable()
export class EdaeUserRefreshTokenGenerator {
  constructor(
    private readonly createRefreshTokenHandler: CreateEdaeUserRefreshTokenHandler,
    private readonly jwtService: JwtService,
  ) {}

  public async generateRefreshToken(
    userId: string,
    expiresIn: number,
  ): Promise<string> {
    const tokenId = uuid();
    const command = new CreateEdaeUserRefreshTokenCommand(
      tokenId,
      userId,
      expiresIn,
    );

    await this.createRefreshTokenHandler.handle(command);

    const opts: SignOptions = {
      expiresIn,
      subject: String(userId),
      jwtid: String(tokenId),
    };

    return this.jwtService.sign({}, opts);
  }
}
