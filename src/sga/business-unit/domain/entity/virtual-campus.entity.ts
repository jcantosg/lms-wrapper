import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class VirtualCampus extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _name: string,
    private _code: string,
    private _businessUnit: BusinessUnit,
    private _isActive: boolean,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
  ) {
    super(id, createdAt, updatedAt);
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
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

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  static createFromBusinessUnit(
    id: string,
    businessUnit: BusinessUnit,
    user: AdminUser,
  ): VirtualCampus {
    return new VirtualCampus(
      id,
      new Date(),
      new Date(),
      businessUnit.name,
      businessUnit.code,
      businessUnit,
      true,
      user,
      user,
    );
  }

  static create(
    id: string,
    name: string,
    code: string,
    businessUnit: BusinessUnit,
    user: AdminUser,
  ): VirtualCampus {
    return new VirtualCampus(
      id,
      new Date(),
      new Date(),
      name,
      code,
      businessUnit,
      true,
      user,
      user,
    );
  }
}
