import { SignOptions } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  public generateToken(userId: string, userEmail: string): string {
    const opts: SignOptions = {
      subject: String(userId),
    };

    return this.jwtService.sign(
      {
        email: userEmail,
      },
      opts,
    );
  }
}
