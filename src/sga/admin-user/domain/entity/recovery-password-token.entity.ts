import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';
import { getDateWithinSeconds, getNow } from '#shared/domain/lib/date';

export class RecoveryPasswordToken extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _user: AdminUser,
    private _expiresAt: Date,
    private _token: string,
  ) {
    super(id, createdAt, updatedAt);
  }
  static createForUser(
    id: string,
    user: AdminUser,
    token: string,
    ttl: number,
  ) {
    const now = getNow();

    return new this(id, now, now, user, getDateWithinSeconds(ttl), token);
  }

  get user(): AdminUser {
    return this._user;
  }

  set user(value: AdminUser) {
    this._user = value;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  set expiresAt(expiresAt: Date) {
    this._expiresAt = expiresAt;
  }

  get token(): string {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }
}
