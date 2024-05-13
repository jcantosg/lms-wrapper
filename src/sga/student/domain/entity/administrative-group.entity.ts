import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Student } from '#student/domain/entity/student.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BaseEntity } from '#shared/domain/entity/base.entity';

export class AdministrativeGroup extends BaseEntity {
  private constructor(
    id: string,
    private _code: string,
    private _businessUnit: BusinessUnit,
    private _academicPeriod: AcademicPeriod,
    private _academicProgram: AcademicProgram,
    private _programBlock: ProgramBlock,
    private _students: Student[],
    private _teachers: EdaeUser[],
    createdAt: Date,
    updatedAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get code(): string {
    return this._code;
  }

  public set code(value: string) {
    this._code = value;
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

  public get academicProgram(): AcademicProgram {
    return this._academicProgram;
  }

  public set academicProgram(value: AcademicProgram) {
    this._academicProgram = value;
  }

  public get programBlock(): ProgramBlock {
    return this._programBlock;
  }

  public set programBlock(value: ProgramBlock) {
    this._programBlock = value;
  }

  public get students(): Student[] {
    return this._students;
  }

  public set students(value: Student[]) {
    this._students = value;
  }

  public get teachers(): EdaeUser[] {
    return this._teachers;
  }

  public set teachers(value: EdaeUser[]) {
    this._teachers = value;
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
    code: string,
    businessUnit: BusinessUnit,
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    programBlock: ProgramBlock,
    user: AdminUser,
  ): AdministrativeGroup {
    return new AdministrativeGroup(
      id,
      code,
      businessUnit,
      academicPeriod,
      academicProgram,
      programBlock,
      [],
      [],
      new Date(),
      new Date(),
      user,
      user,
    );
  }
}
