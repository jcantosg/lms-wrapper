import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitWrongNameLengthException } from '#shared/domain/exception/business-unit/business-unit-wrong-name-length.exception';

const START_POSITION = 0;
const END_POSITION = 3;

export class ExaminationCenter extends BaseEntity {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    private _name: string,
    private _code: string,
    private _businessUnits: BusinessUnit[],
    private _isActive: boolean,
    private _address: string,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _isMain: boolean,
  ) {
    super(id, createdAt, updatedAt);
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

  public get businessUnits(): BusinessUnit[] {
    return this._businessUnits;
  }

  public set businessUnits(value: BusinessUnit[]) {
    this._businessUnits = value;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
  }

  public get address(): string {
    return this._address;
  }

  public set address(value: string) {
    this._address = value;
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

  public get isMain(): boolean {
    return this._isMain;
  }

  public set isMain(value: boolean) {
    this._isMain = value;
  }

  static create(
    id: string,
    name: string,
    code: string,
    businessUnits: BusinessUnit[],
    address: string,
    user: AdminUser,
  ): ExaminationCenter {
    return new ExaminationCenter(
      id,
      new Date(),
      new Date(),
      name,
      code,
      businessUnits,
      true,
      address,
      user,
      user,
      false,
    );
  }

  static createFromBusinessUnit(
    id: string,
    businessUnit: BusinessUnit,
    user: AdminUser,
  ): ExaminationCenter {
    if (businessUnit.name.length <= END_POSITION) {
      throw new BusinessUnitWrongNameLengthException();
    }
    let code = businessUnit.name
      .substring(START_POSITION, END_POSITION)
      .toUpperCase();
    code = `${code}01`;

    return new ExaminationCenter(
      id,
      new Date(),
      new Date(),
      businessUnit.name,
      code,
      [businessUnit],
      true,
      '',
      user,
      user,
      true,
    );
  }
}
