import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Student } from '#shared/domain/entity/student.entity';
import { getDateWithinSeconds } from '#shared/domain/lib/date';

export class StudentRecoveryPasswordToken extends BaseEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _student: Student,
    private _expiresAt: Date,
    private _token: string,
    private _isRedeemed: boolean,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get student(): Student {
    return this._student;
  }

  public set student(value: Student) {
    this._student = value;
  }

  public get expiresAt(): Date {
    return this._expiresAt;
  }

  public set expiresAt(value: Date) {
    this._expiresAt = value;
  }

  public get token(): string {
    return this._token;
  }

  public set token(value: string) {
    this._token = value;
  }

  public get isRedeemed(): boolean {
    return this._isRedeemed;
  }

  public set isRedeemed(value: boolean) {
    this._isRedeemed = value;
  }

  static create(id: string, ttl: number, token: string, student: Student) {
    return new StudentRecoveryPasswordToken(
      id,
      new Date(),
      new Date(),
      student,
      getDateWithinSeconds(ttl),
      token,
      false,
    );
  }
}
