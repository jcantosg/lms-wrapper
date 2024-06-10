import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { StudentGetter } from '#shared/domain/service/student-getter.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'student-jwt') {
  constructor(
    private readonly jwtSecret: string,
    private readonly studentGetter: StudentGetter,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return await this.studentGetter.get(payload.sub);
  }
}
