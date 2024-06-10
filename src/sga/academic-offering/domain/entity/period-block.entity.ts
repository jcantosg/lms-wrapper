import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import {
  calculateAcademicYear,
  calculateStartMonth,
} from '#shared/domain/lib/date';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';

export class PeriodBlock extends BaseEntity {
  private _startMonth: MonthEnum;
  private _academicYear: string;

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _academicPeriod: AcademicPeriod,
    private _name: string,
    private _startDate: Date,
    private _endDate: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _blockRelation: BlockRelation | null,
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

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get startMonth(): MonthEnum {
    return this._startMonth;
  }

  public set startMonth(value: MonthEnum) {
    this._startMonth = value;
  }

  public get academicYear(): string {
    return this._academicYear;
  }

  public set academicYear(value: string) {
    this._academicYear = value;
  }

  public get blockRelation(): BlockRelation | null {
    return this._blockRelation;
  }

  public set blockRelation(value: BlockRelation | null) {
    this._blockRelation = value;
  }

  public static create(
    id: string,
    academicPeriod: AcademicPeriod,
    name: string,
    startDate: Date,
    endDate: Date,
    user: AdminUser,
  ): PeriodBlock {
    const periodBlock = new PeriodBlock(
      id,
      new Date(),
      new Date(),
      academicPeriod,
      name,
      startDate,
      endDate,
      user,
      user,
      null,
    );

    periodBlock._startMonth = calculateStartMonth(startDate);
    periodBlock._academicYear = calculateAcademicYear(startDate);

    return periodBlock;
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

  public blockNumber(): number {
    return Number.isNaN(Number(this._name.slice(-1)))
      ? 0
      : Number(this._name.slice(-1));
  }
}
