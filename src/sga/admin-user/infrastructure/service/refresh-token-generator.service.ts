import { CreateRefreshTokenCommand } from '#admin-user/application/create-refresh-token/create-refresh-token.command';
import { CreateRefreshTokenHandler } from '#admin-user/application/create-refresh-token/create-refresh-token.handler';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RefreshTokenGenerator {
  constructor(
    private readonly createRefreshTokenHandler: CreateRefreshTokenHandler,
    private readonly jwtService: JwtService,
  ) {}

  public async generateRefreshToken(
    userId: string,
    expiresIn: number,
  ): Promise<string> {
    const tokenId = uuid();
    const command = new CreateRefreshTokenCommand(tokenId, userId, expiresIn);

    await this.createRefreshTokenHandler.handle(command);

    const opts: SignOptions = {
      expiresIn,
      subject: String(userId),
      jwtid: String(tokenId),
    };

    return this.jwtService.sign({}, opts);
  }
}
