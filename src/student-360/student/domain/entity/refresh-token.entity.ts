import { BaseEntity } from '#shared/domain/entity/base.entity';
import { getDateWithinSeconds, getNow } from '#shared/domain/lib/date';
import { Student } from '#shared/domain/entity/student.entity';

export class StudentRefreshToken extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _user: Student,
    private _isRevoked: boolean,
    private _expiresAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static createForUser(id: string, user: Student, ttl: number) {
    const now = getNow();

    return new this(id, now, now, user, false, getDateWithinSeconds(ttl));
  }

  get user(): Student {
    return this._user;
  }

  set user(value: Student) {
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
