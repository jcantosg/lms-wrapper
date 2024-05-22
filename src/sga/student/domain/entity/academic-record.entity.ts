import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { Student } from '#shared/domain/entity/student.entity';

export class AcademicRecord extends BaseEntity {
  private constructor(
    id: string,
    private _businessUnit: BusinessUnit,
    private _virtualCampus: VirtualCampus,
    private _student: Student,
    private _academicPeriod: AcademicPeriod,
    private _academicProgram: AcademicProgram,
    private _modality: AcademicRecordModalityEnum,
    private _isModular: boolean,
    private _status: AcademicRecordStatusEnum,
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get businessUnit(): BusinessUnit {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit) {
    this._businessUnit = value;
  }

  public get virtualCampus(): VirtualCampus {
    return this._virtualCampus;
  }

  public set virtualCampus(value: VirtualCampus) {
    this._virtualCampus = value;
  }

  public get student(): Student {
    return this._student;
  }

  public set student(value: Student) {
    this._student = value;
  }

  public get academicPeriod(): AcademicPeriod {
    return this._academicPeriod;
  }

  public set academicPeriod(value: AcademicPeriod) {
    this._academicPeriod = value;
  }

  public get academicProgram(): AcademicProgram {
    return this._academicProgram;
  }

  public set academicProgram(value: AcademicProgram) {
    this._academicProgram = value;
  }

  public get modality(): AcademicRecordModalityEnum {
    return this._modality;
  }

  public set modality(value: AcademicRecordModalityEnum) {
    this._modality = value;
  }

  public get isModular(): boolean {
    return this._isModular;
  }

  public set isModular(value: boolean) {
    this._isModular = value;
  }

  public get status(): AcademicRecordStatusEnum {
    return this._status;
  }

  public set status(value: AcademicRecordStatusEnum) {
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

  static create(
    id: string,
    businessUnit: BusinessUnit,
    virtualCampus: VirtualCampus,
    student: Student,
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    modality: AcademicRecordModalityEnum,
    isModular: boolean,
    user: AdminUser,
  ): AcademicRecord {
    return new AcademicRecord(
      id,
      businessUnit,
      virtualCampus,
      student,
      academicPeriod,
      academicProgram,
      modality,
      isModular,
      AcademicRecordStatusEnum.VALID,
      new Date(),
      new Date(),
      user,
      user,
    );
  }

  update(
    status: AcademicRecordStatusEnum,
    modality: AcademicRecordModalityEnum,
    isModular: boolean,
    adminUser: AdminUser,
  ) {
    this._status = status;
    this._modality = modality;
    this._isModular = isModular;
    this.updatedAt = new Date();
    this._updatedBy = adminUser;
  }
}
