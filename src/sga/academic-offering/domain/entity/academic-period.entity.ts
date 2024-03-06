import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { AcademicPeriodWrongBlockNumberException } from '#shared/domain/exception/academic-period/academic-period.wrong-block-number.exception';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

const MIN_BLOCK_NUMBER = 1;

export class AcademicPeriod extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _code: string,
    private _startDate: Date,
    private _endDate: Date,
    private _businessUnit: BusinessUnit,
    private _examinationCalls: ExaminationCall[],
    private _blocksNumber: number,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    name: string,
    code: string,
    startDate: Date,
    endDate: Date,
    businessUnit: BusinessUnit,
    blocksNumber: number,
    user: AdminUser,
  ): AcademicPeriod {
    if (blocksNumber < MIN_BLOCK_NUMBER) {
      throw new AcademicPeriodWrongBlockNumberException();
    }

    return new AcademicPeriod(
      id,
      name,
      code,
      startDate,
      endDate,
      businessUnit,
      [],
      blocksNumber,
      new Date(),
      new Date(),
      user,
      user,
    );
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get code(): string {
    return this._code;
  }

  public set code(value: string) {
    this._code = value;
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

  public get businessUnit(): BusinessUnit {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit) {
    this._businessUnit = value;
  }

  public get examinationCalls(): ExaminationCall[] {
    return this._examinationCalls;
  }

  public set examinationCalls(value: ExaminationCall[]) {
    this._examinationCalls = value;
  }

  public get blocksNumber(): number {
    return this._blocksNumber;
  }

  public set blocksNumber(value: number) {
    this._blocksNumber = value;
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