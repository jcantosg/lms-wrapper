import { BaseEntity } from '#shared/domain/entity/base.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';

export class SubjectCall extends BaseEntity {
  private constructor(
    id: string,
    private _enrollment: Enrollment,
    private _callNumber: number,
    private _callDate: Date,
    private _finalGrade: SubjectCallFinalGradeEnum,
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
    finalGrade: SubjectCallFinalGradeEnum,
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

  public get finalGrade(): SubjectCallFinalGradeEnum {
    return this._finalGrade;
  }

  public set finalGrade(value: SubjectCallFinalGradeEnum) {
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

  private calculateStatus(): SubjectCallStatusEnum {
    const gradeToStatusMap: Record<
      SubjectCallFinalGradeEnum,
      SubjectCallStatusEnum
    > = {
      [SubjectCallFinalGradeEnum.ONE]: SubjectCallStatusEnum.NOT_PASSED,
      [SubjectCallFinalGradeEnum.TWO]: SubjectCallStatusEnum.NOT_PASSED,
      [SubjectCallFinalGradeEnum.THREE]: SubjectCallStatusEnum.NOT_PASSED,
      [SubjectCallFinalGradeEnum.FOUR]: SubjectCallStatusEnum.NOT_PASSED,
      [SubjectCallFinalGradeEnum.FIVE]: SubjectCallStatusEnum.PASSED,
      [SubjectCallFinalGradeEnum.SIX]: SubjectCallStatusEnum.PASSED,
      [SubjectCallFinalGradeEnum.SEVEN]: SubjectCallStatusEnum.PASSED,
      [SubjectCallFinalGradeEnum.EIGHT]: SubjectCallStatusEnum.PASSED,
      [SubjectCallFinalGradeEnum.NINE]: SubjectCallStatusEnum.PASSED,
      [SubjectCallFinalGradeEnum.TEN]: SubjectCallStatusEnum.PASSED,
      [SubjectCallFinalGradeEnum.NP]: SubjectCallStatusEnum.NOT_PRESENTED,
      [SubjectCallFinalGradeEnum.RC]: SubjectCallStatusEnum.RENOUNCED,
      [SubjectCallFinalGradeEnum.NA]: SubjectCallStatusEnum.NOT_PASSED,
      [SubjectCallFinalGradeEnum.ONGOING]: SubjectCallStatusEnum.ONGOING,
    };

    return gradeToStatusMap[this._finalGrade];
  }
  public update(
    month: MonthEnum,
    year: number,
    finalGrade: SubjectCallFinalGradeEnum,
    user: AdminUser,
  ): void {
    const day = 1;
    const hour = 15;
    this._callDate = new Date(year, month, day, hour);
    this._finalGrade = finalGrade;
    this._status = this.calculateStatus();
    this._updatedBy = user;
    this.updatedAt = new Date();
  }

  public hasFinalGrade(): boolean {
    return ![
      SubjectCallFinalGradeEnum.ONGOING,
      SubjectCallFinalGradeEnum.NA,
    ].includes(this.finalGrade);
  }
}
