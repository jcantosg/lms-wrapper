import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';

export class SubjectCallScheduleHistory extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _businessUnit: BusinessUnit,
    private _academicPeriod: AcademicPeriod,
    private _academicPrograms: AcademicProgram[],
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(
    id: string,
    user: AdminUser,
    businessUnit: BusinessUnit,
    academicPeriod: AcademicPeriod,
    academicPrograms: AcademicProgram[],
  ): SubjectCallScheduleHistory {
    return new SubjectCallScheduleHistory(
      id,
      new Date(),
      new Date(),
      user,
      user,
      businessUnit,
      academicPeriod,
      academicPrograms,
    );
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

  public get businessUnit(): BusinessUnit {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit) {
    this._businessUnit = value;
  }

  public get academicPeriod(): AcademicPeriod {
    return this._academicPeriod;
  }

  public set academicPeriod(value: AcademicPeriod) {
    this._academicPeriod = value;
  }

  public get academicPrograms(): AcademicProgram[] {
    return this._academicPrograms;
  }

  public set academicPrograms(value: AcademicProgram[]) {
    this._academicPrograms = value;
  }
}
