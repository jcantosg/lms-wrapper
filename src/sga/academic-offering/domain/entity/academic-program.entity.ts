import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Title } from '#academic-offering/domain/entity/title.entity';

export class AcademicProgram extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _code: string,
    private _title: Title,
    private _businessUnit: BusinessUnit,
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
    title: Title,
    businessUnit: BusinessUnit,
    user: AdminUser,
  ): AcademicProgram {
    return new AcademicProgram(
      id,
      name,
      code,
      title,
      businessUnit,
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

  public get title(): Title {
    return this._title;
  }

  public set title(value: Title) {
    this._title = value;
  }

  public get businessUnit(): BusinessUnit {
    return this._businessUnit;
  }

  public set businessUnit(value: BusinessUnit) {
    this._businessUnit = value;
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

  public update(
    name: string,
    code: string,
    title: Title,
    updatedBy: AdminUser,
  ): void {
    this.name = name;
    this.code = code;
    this.title = title;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }
}
