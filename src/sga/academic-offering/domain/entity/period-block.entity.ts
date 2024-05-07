import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';

export class PeriodBlock extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _academicPeriod: AcademicPeriod,
    private _startDate: Date,
    private _endDate: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get academicPeriod(): AcademicPeriod {
    return this._academicPeriod;
  }

  public set academicPeriod(value: AcademicPeriod) {
    this._academicPeriod = value;
  }

  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(value: Date) {
    this._startDate = value;
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(value: Date) {
    this._endDate = value;
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

  public static create(
    id: string,
    academicPeriod: AcademicPeriod,
    startDate: Date,
    endDate: Date,
    user: AdminUser,
  ): PeriodBlock {
    return new PeriodBlock(
      id,
      new Date(),
      new Date(),
      academicPeriod,
      startDate,
      endDate,
      user,
      user,
    );
  }

  public updateStartDate(date: Date, user: AdminUser) {
    this._startDate = date;
    this.updatedAt = new Date();
    this._updatedBy = user;
  }

  public updateEndDate(date: Date, user: AdminUser) {
    this._endDate = date;
    this.updatedAt = new Date();
    this._updatedBy = user;
  }
}
