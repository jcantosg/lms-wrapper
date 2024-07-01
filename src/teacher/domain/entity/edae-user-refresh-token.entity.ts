import { BaseEntity } from '#shared/domain/entity/base.entity';
import { getDateWithinSeconds, getNow } from '#shared/domain/lib/date';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export class EdaeUserRefreshToken extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _user: EdaeUser,
    private _isRevoked: boolean,
    private _expiresAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static createForUser(id: string, user: EdaeUser, ttl: number) {
    const now = getNow();

    return new this(id, now, now, user, false, getDateWithinSeconds(ttl));
  }

  get user(): EdaeUser {
    return this._user;
  }

  set user(value: EdaeUser) {
    this._user = value;
  }

  get isRevoked(): boolean {
    return this._isRevoked;
  }

  set isRevoked(isRevoked: boolean) {
    this._isRevoked = isRevoked;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  set expiresAt(expiresAt: Date) {
    this._expiresAt = expiresAt;
  }
}
