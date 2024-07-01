import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'edae-jwt') {
  constructor(
    private readonly jwtSecret: string,
    private readonly edaeUserGetter: EdaeUserGetter,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return await this.edaeUserGetter.get(payload.sub);
  }
}
