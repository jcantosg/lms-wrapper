import { SignOptions } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Injectable()
export class JwtTokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  public generateToken(
    userId: string,
    userEmail: string,
    userRoles: AdminUserRoles[],
    businessUnits: string[],
  ): string {
    const opts: SignOptions = {
      subject: String(userId),
    };

    return this.jwtService.sign(
      {
        email: userEmail,
        roles: userRoles,
        businessUnits,
      },
      opts,
    );
  }
}
