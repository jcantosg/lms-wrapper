import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class Title extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _officialCode: string | null,
    private _officialTitle: string,
    private _officialProgram: string,
    private _businessUnit: BusinessUnit,
    createdAt: Date,
    updateAt: Date,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updateAt);
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get officialCode(): string | null {
    return this._officialCode;
  }

  public set officialCode(value: string | null) {
    this._officialCode = value;
  }

  public get officialTitle(): string {
    return this._officialTitle;
  }

  public set officialTitle(value: string) {
    this._officialTitle = value;
  }

  public get officialProgram(): string {
    return this._officialProgram;
  }

  public set officialProgram(value: string) {
    this._officialProgram = value;
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

  get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }

  static create(
    id: string,
    name: string,
    officialCode: string | null,
    officialTitle: string,
    officialProgram: string,
    businessUnit: BusinessUnit,
    user: AdminUser,
  ): Title {
    return new Title(
      id,
      name,
      officialCode,
      officialTitle,
      officialProgram,
      businessUnit,
      new Date(),
      new Date(),
      user,
      user,
    );
  }

  public update(
    name: string,
    officialCode: string | null,
    officialTitle: string,
    officialProgram: string,
    businessUnit: BusinessUnit,
    user: AdminUser,
  ) {
    this._name = name;
    this._officialCode = officialCode;
    this._officialTitle = officialTitle;
    this._officialProgram = officialProgram;
    this._businessUnit = businessUnit;
    this.updatedAt = new Date();
    this.updatedBy = user;
  }
}
