import { BaseEntity } from '#shared/domain/entity/base.entity';
import { TimeZoneEnum } from '#shared/domain/enum/time-zone.enum';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export class ExaminationCall extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _startDate: Date,
    private _endDate: Date,
    private _timezone: TimeZoneEnum,
    private _academicPeriod: AcademicPeriod,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    name: string,
    startDate: Date,
    endDate: Date,
    timeZone: TimeZoneEnum,
    academicPeriod: AcademicPeriod,
  ): ExaminationCall {
    return new ExaminationCall(
      id,
      name,
      startDate,
      endDate,
      timeZone,
      academicPeriod,
      new Date(),
      new Date(),
    );
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(value: Date) {
    this._endDate = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(value: Date) {
    this._startDate = value;
  }

  public get timezone(): TimeZoneEnum {
    return this._timezone;
  }

  public set timezone(value: TimeZoneEnum) {
    this._timezone = value;
  }

  public get academicPeriod(): AcademicPeriod {
    return this._academicPeriod;
  }

  public set academicPeriod(value: AcademicPeriod) {
    this._academicPeriod = value;
  }
}
