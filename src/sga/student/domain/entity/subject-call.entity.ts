import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { SubjectFinalCallGradeEnum } from '#student/domain/enum/enrollment/subject-final-call-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class SubjectCall extends BaseEntity {
  private constructor(
    id: string,
    private _enrollment: Enrollment,
    private _callNumber: number,
    private _callDate: Date,
    private _finalGrade: SubjectFinalCallGradeEnum,
    private _status: SubjectCallStatusEnum,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    enrollment: Enrollment,
    callNumber: number,
    callDate: Date,
    finalGrade: SubjectFinalCallGradeEnum,
    status: SubjectCallStatusEnum,
    user: AdminUser,
  ): SubjectCall {
    return new SubjectCall(
      id,
      enrollment,
      callNumber,
      callDate,
      finalGrade,
      status,
      new Date(),
      new Date(),
      user,
      user,
    );
  }

  public get enrollment(): Enrollment {
    return this._enrollment;
  }

  public set enrollment(value: Enrollment) {
    this._enrollment = value;
  }

  public get callNumber(): number {
    return this._callNumber;
  }

  public set callNumber(value: number) {
    this._callNumber = value;
  }

  public get callDate(): Date {
    return this._callDate;
  }

  public set callDate(value: Date) {
    this._callDate = value;
  }

  public get finalGrade(): SubjectFinalCallGradeEnum {
    return this._finalGrade;
  }

  public set finalGrade(value: SubjectFinalCallGradeEnum) {
    this._finalGrade = value;
  }

  public get status(): SubjectCallStatusEnum {
    return this._status;
  }

  public set status(value: SubjectCallStatusEnum) {
    this._status = value;
  }

  public get createdBy(): AdminUser {
    return this._createdBy;
  }

  public set createdBy(value: AdminUser) {
    this._createdBy = value;
  }

  public get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  public set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }
}
